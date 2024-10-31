import React, { useEffect, useRef } from 'react';

interface DialogProps {
  isOpen: boolean;                // Control the open/close state of the dialog
  onClose: () => void;            // Callback function to call when the dialog is closed
  title?: string | React.ReactNode;  // Optional title for the dialog
  children?: React.ReactNode;     // Content to be displayed inside the dialog
  className?: string;             // Additional CSS classes for styling
  showCloseButton?: boolean;      // Flag to determine if close button should be shown
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'; // Dialog size
}

const Dialog: React.FC<DialogProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '', 
  showCloseButton = true, // Default value is true
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open or close the dialog based on isOpen prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        dialog.showModal();  
      } else {
        dialog.close();      
      }
    }
  }, [isOpen]);

  // Handle close event
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={handleClose} />
      )}
      <dialog 
        ref={dialogRef} 
        className={`rounded-lg shadow-lg p-4 ${className} z-50`} 
        onClose={handleClose}
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{title}</h2>
            {showCloseButton && (
              <button 
                className="text-gray-600 hover:text-gray-800 text-4xl" 
                onClick={handleClose}
                aria-label="Close dialog"
              >
                &times;
              </button>
            )}
          </div>
        )}
        <div className="mb-4">{children}</div>
      </dialog>
    </>
  );
};

export default Dialog;
