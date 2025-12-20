import { Trash2, Pencil } from "lucide-react";

// edit and delete buttons for the Events page cards
export default function EditDeleteEvent({ navigate, eventID, handleDelete }) {
  return (
    <div className="px-5 pb-3 flex space-x-2 lg:opacity-0 lg:group-hover:opacity-100 transition">
      <button
        onClick={() => navigate(`/events/${eventID}/edit`)}
        className="flex items-center space-x-1 text-sm px-1 py-1 rounded-full bg-[#F59E0B]/10 text-[#BE3455] hover:bg-[#F59E0B]/20 transition text-xs cursor-pointer dark:bg-[#F59E0B]/20 dark:text-[#E879C0] dark:hover:bg-[#F59E0B]/30"
        title="Edit"
      >
        <Pencil className="w-3 h-3" />
        <span>edit</span>
      </button>

      <button
        onClick={() => handleDelete(eventID)}
        className="flex items-center space-x-1 text-sm px-2 py-1 rounded-full bg-red-100/30 text-red-600 hover:bg-red-200 transition text-xs cursor-pointer dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
        title="Delete"
      >
        <Trash2 className="w-3 h-3" />
        <span>delete</span>
      </button>
    </div>
  );
}


