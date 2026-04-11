/* eslint-disable react/prop-types */
import React, { useState } from "react";

const Popup = ({ onClose, onSave }) => {
  const [text, setText] = useState("");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSave = () => {
    onSave(text);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-4 rounded-lg'>
        <textarea
          className='w-60 h-40 p-2 border border-gray-300 rounded-md resize-none'
          placeholder='Enter text (max 500 characters)'
          maxLength={500}
          value={text}
          onChange={handleTextChange}
        ></textarea>
        <div className='flex justify-end mt-4'>
          <button
            className='px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 mr-2'
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className='px-4 py-2 text-sm text-gray-600 bg-gray-300 rounded hover:bg-gray-400'
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
