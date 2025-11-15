import { useEffect } from "react";
import type { ReactNode } from "react";
import cx from "@/utils/cx";
import "./modal.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  footer?: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

const Modal = ({
  open,
  onClose,
  children,
  title,
  footer,
  className,
  showCloseButton = true,
}: ModalProps) => {

  // Bloqueo de scroll + ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handler);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={cx("modal-panel", className)}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h5 className="modal-title">{title}</h5>}
            {showCloseButton && (
              <button className="modal-close" onClick={onClose}>
                ×
              </button>
            )}
          </div>
        )}

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
