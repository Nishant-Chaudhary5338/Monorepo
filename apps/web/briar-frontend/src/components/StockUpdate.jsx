/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import LogoutButton from '../small-components/LogoutButton';
import { useNavigate, useParams } from 'react-router-dom';
import { decode } from 'js-base64';
import HomeButton from '../small-components/HomeButton';
import { stockTransfer } from '../api/stockTransfer';
import TransferPopup from '../small-components/TransferPopup';

const StockUpdate = () => {
	const [stockData, setstockData] = useState('');
	const { MaterialNumber } = useParams();
	const [stockQty, setStockQty] = useState('');
	const [storageLocation, setStorageLocation] = useState('');
	const [popupMessage, setPopupMessage] = useState('');
	const [showPopup, setShowPopup] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		try {
			const decodedMaterialNumber = decode(MaterialNumber);
			const decodedData = JSON.parse(decodedMaterialNumber);
			setstockData(decodedData);
			console.log(decodedData);

			// Rest of your StockUpdate component code
		} catch (error) {
			console.error('Error parsing data:', error);
			// Handle error, e.g., show an error message
		}
	}, [MaterialNumber]);

	const handleStockQtyChange = (e) => {
		setStockQty(e.target.value);
	};

	const handleStorageLocationChange = (e) => {
		setStorageLocation(e.target.value);
	};

	if (!stockData) {
		return <div>Loading...</div>; // Show loading state until stockData is ready
	}
    
	const user = localStorage.getItem("user");
	const useremail = localStorage.getItem('useremail');

	const data = {
		ZHEAD: {
			MATERIAL: stockData.material,
			PLANT: 'UK21',
			STGE_LOC: stockData.storage_location,
			BATCH: stockData.batch,
			MOVE_STLOC: storageLocation,
			MOVE_BATCH: stockData.batch,
			ENTRY_QNT: stockQty,
			MV_TYPE: '311', //321
			ZNAME: useremail,
		},
	};

	const handleStockTransfer = async () => {
		try {
			const response = await stockTransfer(data);
			const results = response['n0:ZMB_GOODS_MOVEMENTResponse']['RET'];

			// Iterate through the keys of the RET object
			for (const key in results) {
				if (results.hasOwnProperty(key)) {
					// Check if the value is not an empty string
					if (results[key] !== '') {
						console.log(results[key]);
						setShowPopup(true);
						setPopupMessage(results[key]);
					}
				}
			}
		} catch (error) {
			console.log(error);
			alert('Something unexpected happened');
		}
	};

	console.log(data);

	return (
		<div className='bg-gray-50'>
			<div className='bg-[#71a311] px-2 text-xl h-12 flex items-center justify-between'>
				<HomeButton />
				<h1 className='font-semibold text-white'>Stock Updates</h1>
				<LogoutButton />
			</div>

			<div className='p-10 m-20 rounded-3xl px-20 items-center flex justify-between shadow-2xl shadow-[#71a311]'>
				<div className='space-y-2'>
					<div className='flex items-center space-x-2'>
						<span className='text-sm font-semibold text-gray-700 w-28'>
							Material
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.material}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<span className='text-sm font-semibold text-gray-700 w-28'>
							Material Description
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.material_desc}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<span className='text-sm font-semibold text-gray-700 w-28'>
							Storage Location
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.storage_location}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<span className='text-sm font-semibold text-gray-700 w-28'>
							Batch No.
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.batch || 'NA'}
						</span>
					</div>

					<div className='flex items-center space-x-2'>
						<span className='text-sm font-semibold text-gray-700 w-28'>
							Quantity
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.STOCK_QTY}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<span className='text-sm font-semibold text-gray-700 w-28'>
							Base Unit
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.base_unit}
						</span>
					</div>
				</div>
				<div className='space-y-2'>
					<div className='flex items-center space-x-2'>
						<span className='text-sm font-semibold text-gray-700 w-28'>
							Storage Location
						</span>
						<input
							value={storageLocation}
							name='storage_location'
							type='text'
							onChange={handleStorageLocationChange}
							className='border border-[#b4ed47] p-[2px] rounded-md pr-20'
						></input>
					</div>
					<div className='flex items-center space-x-2'>
						<span className='text-sm font-semibold text-gray-700 w-28'>
							Batch No.
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.batch || 'NA'}
						</span>
					</div>

					<div className='flex items-center space-x-2'>
						<span className='text-sm font-semibold text-gray-700 w-28'>
							Quantity
						</span>
						<input
							value={stockQty}
							name='STOCK_QTY'
							type='text'
							onChange={handleStockQtyChange}
							className='border border-[#b4ed47] p-[2px] rounded-md pr-20'
						></input>
					</div>
					<div className='py-4 text-center'>
						<button
							onClick={handleStockTransfer}
							className='px-4 py-2 font-medium text-center text-white bg-blue-500 rounded-md hover:bg-blue-800 active:bg-green-500'
						>
							Transfer
						</button>
					</div>

					{showPopup && (
						<TransferPopup
							message={popupMessage}
							onClose={() => {
								setShowPopup(false);
								navigate('/stockList');
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default StockUpdate;
