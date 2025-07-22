export default function Calendar({ onSelect }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-[#E3CBC1] w-64">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() =>
            setSelectedDate(new Date(currentYear, currentMonth - 1, 1))
          }
        >
          &lt;
        </button>
        <span className="font-semibold">
          {format(selectedDate, "MMMM yyyy")}
        </span>
        <button
          onClick={() =>
            setSelectedDate(new Date(currentYear, currentMonth + 1, 1))
          }
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-[#9B2C62]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentYear, currentMonth, day);
          const isToday = date.toDateString() === today.toDateString();
          const isSelected =
            date.toDateString() === selectedDate.toDateString();

          return (
            <button
              key={day}
              onClick={() => onSelect(date)}
              className={`h-8 rounded-full flex items-center justify-center
                  ${isToday ? "border border-[#BE3455]" : ""}
                  ${
                    isSelected
                      ? "bg-[#BE3455] text-white"
                      : "hover:bg-[#E3CBC1]"
                  }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
