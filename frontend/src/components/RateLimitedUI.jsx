import { Clock3 } from "lucide-react";

const RateLimitedUI = () => {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-in slide-in-from-bottom-5 duration-300">
      <div className="alert border border-warning/30 bg-base-100 shadow-2xl rounded-2xl p-4">
        <div className="flex w-full items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning">
            <Clock3 size={22} />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-base-content">
              Rate Limit Reached
            </h3>

            <p className="mt-1 text-sm text-base-content/70">
              You've made too many requests in a short time. Please wait a
              moment before trying again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;
