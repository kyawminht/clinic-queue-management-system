import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookingPage from '../pages/BookingPage';
import { useAppContext } from '../context/AppContext';
import { useAppointments } from '../hooks/useAppointments';
import { useDoctors } from '../hooks/useDoctors';
import { useTranslation } from '../hooks/useTranslation';
import SubmissionProgress from '../components/SubmissionProgress';
import { useAsyncBookingSubmission } from '../hooks/useAsyncBookingSubmission';

const namePattern = /^[\p{L}\s.'-]{2,}$/u;
const phonePattern = /^09\d{7,9}$/;

function normalizeFieldValue(name, value) {
  if (name === 'age' || name === 'phone') {
    return value.replace(/\D/g, '');
  }

  return value;
}

function BookingPageContainer() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, selectedDate, setSelectedDate } = useAppContext();
  const { doctors } = useDoctors();
  const { createLoading } = useAppointments();
  const { submit, formKey } = useAsyncBookingSubmission();
  const { t } = useTranslation();
  const doctor = doctors.find((item) => item.id === doctorId);

  const [selectedSlot, setSelectedSlot] = useState('');
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    age: currentUser.age || '',
    phone: currentUser.phone || '',
  });
  const [touchedFields, setTouchedFields] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (doctor?.availableSlots?.length && !selectedSlot) {
      setSelectedSlot(doctor.availableSlots[0]);
    }
  }, [doctor, selectedSlot]);

  const validateField = (name, value) => {
    const trimmedValue = value.trim();

    if (name === 'name') {
      if (!trimmedValue) {
        return t('validationNameRequired');
      }

      if (!namePattern.test(trimmedValue)) {
        return t('validationNameInvalid');
      }
    }

    if (name === 'age') {
      if (!trimmedValue) {
        return t('validationAgeRequired');
      }

      const age = Number(trimmedValue);

      if (!Number.isInteger(age) || age < 1 || age > 120) {
        return t('validationAgeInvalid');
      }
    }

    if (name === 'phone') {
      if (!trimmedValue) {
        return t('validationPhoneRequired');
      }

      if (!phonePattern.test(trimmedValue)) {
        return t('validationPhoneInvalid');
      }
    }

    return '';
  };

  const errors = useMemo(
    () => ({
      name: validateField('name', formData.name),
      age: validateField('age', formData.age),
      phone: validateField('phone', formData.phone),
    }),
    [formData.age, formData.name, formData.phone, t]
  );

  const isFormValid = useMemo(
    () => Boolean(selectedSlot) && Object.values(errors).every((error) => !error),
    [errors, selectedSlot]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    const normalizedValue = normalizeFieldValue(name, value);
    setFormData((previous) => ({ ...previous, [name]: normalizedValue }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouchedFields((previous) => ({ ...previous, [name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!doctor || !isFormValid) {
      setTouchedFields({
        name: true,
        age: true,
        phone: true,
      });
      return;
    }

    const sanitizedFormData = {
      name: formData.name.trim(),
      age: formData.age.trim(),
      phone: formData.phone.trim(),
    };

    const handleSubmissionError = (error) => {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Booking submit failed:', error);
      }

      if (error?.code === 'ACTIVE_BOOKING_EXISTS') {
        setCurrentUser(sanitizedFormData);
        navigate('/status');
        return;
      }

      if (error?.code === 'QUEUE_NOT_STARTED') {
        setSubmitError(t('doctorNotStartedHint'));
        return;
      }

      if (error?.status === 400) {
        setSubmitError(error?.message || t('validationGeneric'));
        return;
      }

      setSubmitError(error?.message || 'Request failed');
    };

    try {
      const result = await submit({
        date: selectedDate,
        user: sanitizedFormData,
        doctor,
        slot: selectedSlot,
      }, { title: sanitizedFormData.name });

      if (result?.error) {
        handleSubmissionError(result.error);
        return;
      }

      setCurrentUser(sanitizedFormData);
      if (!result?.queued) {
        navigate('/status');
      }
    } catch (error) {
      handleSubmissionError(error);
    }
  };

  return (
    <>
      <SubmissionProgress formKey={formKey} label={t('saving')} />
      <BookingPage
        doctor={doctor}
        t={t}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        formData={formData}
        errors={errors}
        touchedFields={touchedFields}
        isFormValid={isFormValid}
        createLoading={createLoading}
        submitError={submitError}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default BookingPageContainer;
