import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookingPage from '../pages/BookingPage';
import { useAppContext } from '../context/AppContext';
import { useAppointments } from '../hooks/useAppointments';
import { useDoctors } from '../hooks/useDoctors';
import { useTranslation } from '../hooks/useTranslation';

function BookingPageContainer() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAppContext();
  const { doctors } = useDoctors();
  const { createAppointment, createLoading } = useAppointments();
  const { t } = useTranslation();
  const doctor = doctors.find((item) => item.id === doctorId);

  const [selectedSlot, setSelectedSlot] = useState('');
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    age: currentUser.age || '',
    phone: currentUser.phone || '',
  });

  useEffect(() => {
    if (doctor?.availableSlots?.length && !selectedSlot) {
      setSelectedSlot(doctor.availableSlots[0]);
    }
  }, [doctor, selectedSlot]);

  const isFormValid = useMemo(
    () => selectedSlot && formData.name.trim() && formData.age.trim() && formData.phone.trim(),
    [formData.age, formData.name, formData.phone, selectedSlot]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!doctor || !isFormValid) {
      return;
    }

    await createAppointment({
      user: formData,
      doctor,
      slot: selectedSlot,
    });

    setCurrentUser(formData);
    navigate('/status');
  };

  return (
    <BookingPage
      doctor={doctor}
      t={t}
      selectedSlot={selectedSlot}
      setSelectedSlot={setSelectedSlot}
      formData={formData}
      isFormValid={isFormValid}
      createLoading={createLoading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}

export default BookingPageContainer;
