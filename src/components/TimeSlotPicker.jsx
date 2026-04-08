function TimeSlotPicker({ slots, selectedSlot, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {slots.map((slot) => (
        <button
          key={slot}
          type="button"
          onClick={() => onSelect(slot)}
          className={`h-14 rounded-2xl border-2 px-3 text-base font-bold transition ${
            selectedSlot === slot
              ? 'border-brand-600 bg-brand-600 text-white'
              : 'border-brand-100 bg-brand-50 text-brand-700 hover:border-brand-200'
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}

export default TimeSlotPicker;
