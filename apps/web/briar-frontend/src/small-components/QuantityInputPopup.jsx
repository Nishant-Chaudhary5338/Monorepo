import React, { useState } from 'react';

const QuantityInputPopup = ({ isOpen, onClose, onSubmit, maxQuantity, item }) => {
  const [quantity, setQuantity] = useState('');

  const handleSubmit = () => {
    const qty = parseFloat(quantity);
    if (qty > 0 && qty <= maxQuantity) {
      onSubmit(qty);
      setQuantity('');
      onClose();
    } else {
      alert(`Please enter a valid quantity between 1 and ${maxQuantity}`);
    }
  };

  const handleClose = () => {
    setQuantity('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Enter Quantity to Release</h2>
        <p className="mb-2">Material: {item?.matnr} - {item?.maktx}</p>
        <p className="mb-4">Available Quantity: {maxQuantity}</p>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          min="1"
          max={maxQuantity}
          step="0.01"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Release
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityInputPopup;