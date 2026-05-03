import TimeSlotPicker from '../components/TimeSlotPicker';

function BookingPage({
  doctor,
  t,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  formData,
  errors,
  touchedFields,
  isFormValid,
  createLoading,
  submitError,
  handleChange,
  handleBlur,
  handleSubmit,
}) {
  if (!doctor) {
    return (
      <section className="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-black text-slate-900">{t('doctorNotFound')}</h2>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="pb-28">
      <section className="space-y-5">
        <div className="rounded-[28px] border border-brand-100 bg-brand-50 p-5">
          <p className="text-lg font-black text-brand-700">{t('bookingStep1')}</p>
          <p className="mt-3 text-base font-bold text-slate-800">{t('bookingStep2')}</p>
        </div>

        <div className="rounded-[28px] border border-white bg-white p-5 shadow-soft">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">{t('appointmentDate')}</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold text-slate-900 outline-none transition focus:border-brand-500"
            />
          </label>
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
                onBlur={handleBlur}
                placeholder={t('placeholderName')}
                className={`h-14 w-full rounded-2xl border bg-slate-50 px-4 text-base outline-none ring-0 transition focus:border-brand-500 ${
                  touchedFields.name && errors.name ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {touchedFields.name && errors.name ? (
                <p className="mt-2 text-sm font-medium text-rose-500">{errors.name}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">{t('age')}</span>
              <input
                name="age"
                value={formData.age}
                onChange={handleChange}
                onBlur={handleBlur}
                inputMode="numeric"
                maxLength={3}
                placeholder={t('placeholderAge')}
                className={`h-14 w-full rounded-2xl border bg-slate-50 px-4 text-base outline-none ring-0 transition focus:border-brand-500 ${
                  touchedFields.age && errors.age ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {touchedFields.age && errors.age ? (
                <p className="mt-2 text-sm font-medium text-rose-500">{errors.age}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">{t('phone')}</span>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                inputMode="numeric"
                maxLength={11}
                placeholder={t('placeholderPhone')}
                className={`h-14 w-full rounded-2xl border bg-slate-50 px-4 text-base outline-none ring-0 transition focus:border-brand-500 ${
                  touchedFields.phone && errors.phone ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {touchedFields.phone && errors.phone ? (
                <p className="mt-2 text-sm font-medium text-rose-500">{errors.phone}</p>
              ) : null}
            </label>
          </div>
        </div>
      </section>

      <div className="fixed bottom-[84px] left-0 right-0 px-4">
        <div className="mx-auto max-w-6xl">
          {submitError ? (
            <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {submitError}
            </div>
          ) : null}
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
