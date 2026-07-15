import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import thinkboardLogo from "../assets/thinkboard-logo.png";

const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center">
            <img
              src={thinkboardLogo}
              alt="ThinkBoard"
              className="h-14 w-auto sm:h-16 md:h-18 lg:h-20"
            />
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
