// handle event status colours
export const StatusPill = ({ status }) => (
  <span className={`px-2 py-1 rounded text-xs ${
    status === "Completed" ? "bg-green-100 text-green-800" :
    status === "Cancelled" ? "bg-red-100 text-red-800" :
    status === "In Progress" ? "bg-[#F5EBFF] text-[#9B2C62]" :
    "bg-[#EFF6FF] text-[#1E40AF]"
  }`}>
    {status}
  </span>
);