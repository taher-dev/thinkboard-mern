import { Link } from "react-router";
import { PlusIcon } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="text-lg font-bold text-primary font-mono tracking-tight sm:text-2xl">
              ThinkBoard
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/create" className="btn btn-primary btn-sm sm:btn-md">
              <PlusIcon className="size-4 sm:size-5" />
              <span className="hidden sm:inline">New Note</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
