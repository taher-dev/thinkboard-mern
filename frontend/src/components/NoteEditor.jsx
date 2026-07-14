import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";

const NoteEditor = ({
  title,
  showHeading = true,
  formData,
  setFormData,
  loading,
  onSubmit,
  onCancel,
  submitText = "Save",
  submitLoadingText = "Saving...",
  submitIcon: SubmitIcon,
  headerActions,
  children,
}) => {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-grow textarea
  const adjustTextareaHeight = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [formData.content]);

  // Warn before refreshing/closing tab
  useEffect(() => {
    const hasUnsavedChanges = formData.title.trim() || formData.content.trim();

    const handleBeforeUnload = (e) => {
      if (!hasUnsavedChanges) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData]);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/");
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.ctrlKey &&
      e.key === "Enter" &&
      !loading &&
      formData.title.trim() &&
      formData.content.trim()
    ) {
      e.preventDefault();

      // Submit the form programmatically
      e.currentTarget.requestSubmit();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        // Blur the active element first so the escape feels natural
        document.activeElement?.blur();
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [formData]);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Top row: Back button + header actions */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="btn btn-ghost btn-sm sm:btn-md gap-2"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            Back
          </button>

          {headerActions && <div>{headerActions}</div>}
        </div>

        <div className="card rounded-2xl border border-base-content/10 bg-base-200 shadow-xl">
          <div className="card-body p-6 sm:p-8">
            {/* Heading */}
            {showHeading && title && (
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
                  {title}
                </h1>

                {children && (
                  <div className="mt-2 text-sm text-base-content/60">
                    {children}
                  </div>
                )}
              </div>
            )}

            <form
              onSubmit={onSubmit}
              onKeyDown={handleKeyDown}
              className="space-y-7"
            >
              {/* Note Title */}
              <input
                ref={titleRef}
                type="text"
                name="title"
                placeholder="Note title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    textareaRef.current?.focus();
                  }
                }}
                className="input input-bordered w-full rounded-xl border-base-content/10 bg-base-100 text-lg font-medium placeholder:text-base-content/40 focus:border-primary focus:outline-none"
              />

              {/* Note Content */}
              <div>
                <textarea
                  ref={textareaRef}
                  rows={5}
                  name="content"
                  placeholder="Start writing..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: e.target.value,
                    })
                  }
                  className="textarea textarea-bordered w-full min-h-[140px] resize-none overflow-hidden rounded-xl border-base-content/10 bg-base-100 leading-7 placeholder:text-base-content/40 focus:border-primary focus:outline-none"
                />

                <div className="mt-2 flex justify-end">
                  <span className="text-xs text-base-content/50">
                    {formData.content.length} characters
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-outline border-base-content/15 text-base-content transition-all duration-200 hover:border-base-content/30 hover:bg-base-300/60 hover:text-base-content hover:shadow-sm sm:min-w-[120px]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.title.trim() ||
                    !formData.content.trim()
                  }
                  className="btn btn-primary gap-2 sm:min-w-[140px]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {submitLoadingText}
                    </>
                  ) : (
                    <>
                      {SubmitIcon && <SubmitIcon size={18} />}
                      {submitText}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
