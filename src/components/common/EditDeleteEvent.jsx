import { Trash2, Pencil } from "lucide-react";

// edit and delete buttons for the Events page cards
export default function EditDeleteEvent({ navigate, eventID, handleDelete }) {
  return (
    <div className="absolute top-5 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
      <button
        onClick={() => navigate(`/events/${eventID}/edit`)}
        className="flex items-center space-x-1 text-sm px-1 py-1 rounded-full bg-[#F59E0B]/10 text-[#BE3455] hover:bg-[#F59E0B]/20 transition text-xs cursor-pointer"
        title="Edit"
      >
        <Pencil className="w-3 h-3" />
        <span>edit</span>
      </button>

      <button
        onClick={() => handleDelete(eventID)}
        className="flex items-center space-x-1 text-sm px-2 py-1 rounded-full bg-red-100/30 text-red-600 hover:bg-red-200 transition text-xs cursor-pointer"
        title="Delete"
      >
        <Trash2 className="w-3 h-3" />
        <span>delete</span>
      </button>
    </div>
  );
}

