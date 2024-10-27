import { useState, useEffect, useRef } from "react";
import styles from "./Modal.module.scss";

export const Modal = ({
  isOpen,
  hasCloseBtn = true,
  onClose,
  children
}) => {
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef(null);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
    setModalOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;

    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  return (
    <dialog
			ref={modalRef}
			onKeyDown={handleKeyDown}
			className={styles.modal}
			onClick={(e) => {
				const dialogDimensions = modalRef.current.getBoundingClientRect();
				if (
					e.clientX < dialogDimensions.left ||
					e.clientX > dialogDimensions.right ||
					e.clientY < dialogDimensions.top ||
					e.clientY > dialogDimensions.bottom
				) {
					handleCloseModal();
				}
			}}
			data-modal>
      {hasCloseBtn && (
        <button
					className={styles.modal__close}
					onClick={handleCloseModal}
					data-modal-close />
      )}
      {children}
    </dialog>
  );
};
