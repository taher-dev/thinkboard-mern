import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";

/**
 * A reusable styled confirmation dialog that replaces native window.confirm().
 *
 * @param {boolean}  isOpen       - Whether the dialog is visible
 * @param {Function} onConfirm    - Callback when the user confirms
 * @param {Function} onCancel     - Callback when the user cancels / dismisses
 * @param {string}   title        - Dialog heading
 * @param {string}   message      - Body text
 * @param {string}   confirmText  - Label for the confirm button (default: "Confirm")
 * @param {string}   cancelText   - Label for the cancel button  (default: "Cancel")
 * @param {"danger"|"warning"} variant - Visual style variant
 */
const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  const dialogRef = useRef(null);
  const confirmBtnRef = useRef(null);

  // Focus trap: focus the confirm button when the dialog opens
  useEffect(() => {
    if (isOpen) {
      // Small delay so the animation can start before focus shifts
      const timer = setTimeout(() => confirmBtnRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel();
      }
    },
    [onCancel],
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, handleKeyDown]);

  // Prevent body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  const IconComponent = isDanger ? Trash2 : AlertTriangle;
  const iconBg = isDanger ? "bg-error/10" : "bg-warning/10";
  const iconColor = isDanger ? "text-error" : "text-warning";
  const confirmBtnClass = isDanger
    ? "btn btn-error text-white gap-2"
    : "btn btn-warning text-warning-content gap-2";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      />

      {/* Dialog Card */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-sm bg-base-200 border border-base-content/15 shadow-2xl rounded-2xl p-6 animate-in zoom-in-95 fade-in duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 btn btn-ghost btn-circle btn-sm text-base-content/50 hover:text-base-content"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center`}
          >
            <IconComponent size={24} />
          </div>

          {/* Title */}
          <h3
            id="confirm-dialog-title"
            className="text-lg font-bold text-base-content"
          >
            {title}
          </h3>

          {/* Message */}
          {message && (
            <p className="text-sm text-base-content/70 leading-relaxed">
              {message}
            </p>
          )}

          {/* Actions */}
          <div className="flex w-full gap-3 pt-2">
            <button
              onClick={onCancel}
              className="btn btn-outline flex-1 border-base-content/15 text-base-content hover:text-base-content hover:border-base-content/30 hover:bg-base-300/60"
            >
              {cancelText}
            </button>
            <button
              ref={confirmBtnRef}
              onClick={onConfirm}
              className={`flex-1 ${confirmBtnClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmDialog;
