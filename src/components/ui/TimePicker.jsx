export default function TimePicker({ onSelect }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ["00", "15", "30", "45"];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-[#E3CBC1] w-64">
      <div className="grid grid-cols-4 gap-2">
        {hours.map((hour) =>
          minutes.map((minute) => (
            <button
              key={`${hour}-${minute}`}
              onClick={() => onSelect(hour, parseInt(minute))}
              className={`p-2 rounded ${
                selectedDate.getHours() === hour &&
                selectedDate.getMinutes() === parseInt(minute)
                  ? "bg-[#BE3455] text-white"
                  : "hover:bg-[#E3CBC1]"
              }`}
            >
              {`${hour.toString().padStart(2, "0")}:${minute}`}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
