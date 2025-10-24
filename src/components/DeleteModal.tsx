import { type DeleteModalProps } from "../types/type";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete "{productName}"?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
