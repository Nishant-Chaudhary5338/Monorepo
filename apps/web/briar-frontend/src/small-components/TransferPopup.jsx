import React from 'react';

const TransferPopup = ({ message, onClose }) => {
	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-white p-6 flex flex-col rounded-md'>
				<p className='text-lg'>{message}</p>
				<button
					className='px-4 mx-auto w-40 py-2 justify-center bg-gray-300 text-gray-700 rounded-md mt-4'
					onClick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default TransferPopup;
