import { Link } from "react-router";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import api from "../lib/axios.js";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const handleDelete = async (e, noteId) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${noteId}`);
      setNotes((prevNotes) => prevNotes.filter((n) => n._id !== noteId));
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };
  return (
    <div className="group h-full">
      <div className="card h-full rounded-2xl border border-base-content/10 bg-base-200 transition-all duration-300 hover:border-primary/40 hover:bg-base-100 hover:shadow-xl">
        <div className="card-body p-4 sm:p-5">
          {/* Clickable Content */}
          <Link to={`/note/${note._id}`} className="flex-1">
            {/* Header */}
            <div>
              <h2 className="truncate text-base font-semibold text-base-content transition-colors duration-300 group-hover:text-primary sm:text-lg">
                {note.title}
              </h2>
            </div>

            {/* Preview */}
            <p className="mt-4 line-clamp-4 text-sm leading-6 text-base-content/70 sm:text-[15px]">
              {note.content}
            </p>
          </Link>

          {/* Footer */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-base-content/60 sm:text-sm">
              <CalendarDays size={14} />
              <span>
                {new Date(note.updatedAt || note.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 sm:justify-start">
              <Link
                to={`/note/${note._id}`}
                onClick={(e) => e.stopPropagation()}
                className="btn btn-sm btn-circle btn-ghost text-base-content/70 hover:bg-primary/10 hover:text-primary"
              >
                <Pencil size={16} />
              </Link>

              <button
                onClick={(e) => {
                  handleDelete(e, note._id);
                }}
                className="btn btn-sm btn-circle btn-ghost text-base-content/70 hover:bg-error/10 hover:text-error"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
