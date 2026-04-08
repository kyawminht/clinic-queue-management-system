import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TimeSlotPicker from '../components/TimeSlotPicker';
import { useAppContext } from '../context/AppContext';
import { useAppointments } from '../hooks/useAppointments';
import { useTranslation } from '../hooks/useTranslation';

function BookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { currentUser, getDoctorById } = useAppContext();
  const { createAppointment, createLoading } = useAppointments();
  const { t } = useTranslation();
  const doctor = getDoctorById(doctorId);

  const [selectedSlot, setSelectedSlot] = useState(doctor?.availableSlots[0] || '');
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    age: currentUser.age || '',
    phone: currentUser.phone || '',
  });

  const isFormValid = useMemo(
    () => selectedSlot && formData.name.trim() && formData.age.trim() && formData.phone.trim(),
    [formData.age, formData.name, formData.phone, selectedSlot]
  );

  if (!doctor) {
    return (
      <section className="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-black text-slate-900">{t('doctorNotFound')}</h2>
      </section>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    await createAppointment({
      user: formData,
      doctor,
      slot: selectedSlot,
    });

    navigate('/status');
  };

  return (
    <form onSubmit={handleSubmit} className="pb-28">
      <section className="space-y-5">
        <div className="rounded-[28px] border border-brand-100 bg-brand-50 p-5">
          <p className="text-lg font-black text-brand-700">{t('bookingStep1')}</p>
          <p className="mt-3 text-base font-bold text-slate-800">{t('bookingStep2')}</p>
        </div>

        <div className="rounded-[28px] border border-white bg-white p-5 shadow-soft">
          <div className="flex items-center gap-4">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-brand-50"
            />
            <div>
              <h2 className="text-2xl font-black text-slate-900">{doctor.name}</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">{t(doctor.specialtyKey)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white bg-white p-5 shadow-soft">
          <h3 className="text-lg font-black text-slate-900">{t('chooseTime')}</h3>
          <p className="mt-1 text-sm text-slate-500">{t('tapOneTime')}</p>
          <div className="mt-4">
            <TimeSlotPicker
              slots={doctor.availableSlots}
              selectedSlot={selectedSlot}
              onSelect={setSelectedSlot}
            />
          </div>
        </div>

        <div className="rounded-[28px] border border-white bg-white p-5 shadow-soft">
          <h3 className="text-lg font-black text-slate-900">{t('yourDetails')}</h3>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">{t('name')}</span>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('placeholderName')}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base outline-none ring-0 transition focus:border-brand-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">{t('age')}</span>
              <input
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder={t('placeholderAge')}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base outline-none ring-0 transition focus:border-brand-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">{t('phone')}</span>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('placeholderPhone')}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base outline-none ring-0 transition focus:border-brand-500"
              />
            </label>
          </div>
        </div>
      </section>

      <div className="fixed bottom-[84px] left-0 right-0 px-4">
        <div className="mx-auto max-w-6xl">
          <button
            type="submit"
            disabled={!isFormValid || createLoading}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-brand-600 text-base font-black text-white shadow-lg shadow-sky-200 transition disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {createLoading ? t('saving') : t('confirmBooking')}
          </button>
        </div>
      </div>
    </form>
  );
}

export default BookingPage;
