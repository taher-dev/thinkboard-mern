import { Link } from "react-router";
import { FilePlus2, NotebookPen } from "lucide-react";

const NotesNotFound = () => {
  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-base-content/10 bg-base-200 p-8 text-center shadow-xl">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-full bg-primary/10 text-primary">
          {" "}
          <NotebookPen size={38} strokeWidth={1.8} />
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-2xl font-bold text-base-content">
          No notes yet
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm leading-7 text-base-content/60 sm:text-base">
          Looks a little empty here.
          <br />
          Create your first note and start capturing your ideas.
        </p>

        {/* CTA */}
        <Link
          to="/create"
          className="btn btn-primary mt-8 w-full gap-2 rounded-xl sm:w-auto sm:px-6"
        >
          <FilePlus2 size={18} />
          <span>Create Your First Note</span>
        </Link>
      </div>
    </div>
  );
};

export default NotesNotFound;
