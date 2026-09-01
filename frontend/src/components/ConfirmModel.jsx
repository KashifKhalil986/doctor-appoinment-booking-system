const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const isCancel = title?.toLowerCase().includes("cancel");

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className={`text-white px-4 py-2 rounded ${
              isCancel
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary hover:bg-blue-700"
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
