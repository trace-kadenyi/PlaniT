export default function ProgressBar({ value, className = "" }) {
  const progressColor = value > 90 
    ? "bg-[#9B2C62]" // Deep mulberry for critical
    : value > 70 
      ? "bg-[#D97706]" // Saffron gold for warning
      : "bg-[#F59E0B]"; // Lighter gold for normal

  return (
    <div className={`w-full bg-[#F3EDE9] rounded-full h-2 ${className}`}>
      <div
        className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}