/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import LogoutButton from '../small-components/LogoutButton';
import { useNavigate, useParams } from 'react-router-dom';
import { decode } from 'js-base64';
import HomeButton from '../small-components/HomeButton';
import { stockTransfer } from '../api/stockTransfer';
import TransferPopup from '../small-components/TransferPopup';

const QcUpdate = () => {
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

	console.log('stockData', stockData);

	const handleStockQtyChange = (e) => {
		setStockQty(e.target.value);
	};

	const handleStorageLocationChange = (e) => {
		setStorageLocation(e.target.value);
	};

	if (!stockData) {
		return <div>Loading...</div>; // Show loading state until stockData is ready
	}

	const data = {
		ZHEAD: {
			MATERIAL: stockData.matnr,
			PLANT: 'UK21',
			STGE_LOC: stockData.lgort,
			BATCH: stockData.charg,
			MOVE_STLOC: stockData.lgort,
			MOVE_BATCH: stockData.charg,
			ENTRY_QNT: stockData.cinsm,
			MV_TYPE: '321',
		},
	};

	const handleStockTransfer = async () => {
		try {
			const response = await stockTransfer(data);
			console.log(data);
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
			alert('Error');
		}
	};

	console.log(data);

	return (
		<div className='bg-gray-50'>
			<div className='bg-[#71a311] px-2 text-xl h-12 flex items-center justify-between'>
				<HomeButton />
				<h1 className='text-white font-semibold'>QCR Updates</h1>
				<LogoutButton />
			</div>

			<div className='p-10 m-20 rounded-3xl px-20 items-center flex justify-between shadow-2xl shadow-[#71a311]'>
				<div className='space-y-2'>
					<div className='flex space-x-2 items-center'>
						<span className=' text-sm text-gray-700 font-semibold w-28'>
							Material
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.matnr}
						</span>
					</div>
					<div className='flex space-x-2 items-center'>
						<span className=' text-sm text-gray-700 font-semibold w-28'>
							Material Description
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData?.maktx}
						</span>
					</div>
					<div className='flex space-x-2 items-center'>
						<span className=' text-sm text-gray-700 font-semibold w-28'>
							Storage Location
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.lgort}
						</span>
					</div>
					<div className='flex space-x-2 items-center'>
						<span className=' text-sm text-gray-700 font-semibold w-28'>
							Batch No.
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.charg}
						</span>
					</div>

					<div className='flex space-x-2 items-center'>
						<span className=' text-sm text-gray-700 font-semibold w-28'>
							Quantity
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.cinsm}
						</span>
					</div>
					<div className='flex space-x-2 items-center'>
						<span className=' text-sm text-gray-700 font-semibold w-28'>
							Base Unit
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData?.unitOfMeasure}
						</span>
					</div>
				</div>
				<div className='space-y-2'>
					<div className='flex space-x-2 items-center'>
						<span className=' text-sm text-gray-700 font-semibold w-28'>
							Storage Location
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.lgort}
						</span>
						{/* <input
							value={storageLocation}
							name='storage_location'
							type='text'
							onChange={handleStorageLocationChange}
							className='border border-[#b4ed47] p-[2px] rounded-md pr-20'
						></input> */}
					</div>
					<div className='flex space-x-2 items-center'>
						<span className=' text-sm text-gray-700 font-semibold w-28'>
							Batch No.
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.charg}
						</span>
					</div>

					<div className='flex space-x-2 items-center'>
						<span className=' text-sm text-gray-700 font-semibold w-28'>
							Quantity
						</span>
						<span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
							{stockData.cinsm}
						</span>
						{/*
						<input
							value={stockQty}
							name='STOCK_QTY'
							type='text'
							onChange={handleStockQtyChange}
							className='border border-[#b4ed47] p-[2px] rounded-md pr-20'
						></input>
						*/}
					</div>
					<div className='text-center py-4'>
						<button
							onClick={handleStockTransfer}
							className='bg-blue-500 hover:bg-blue-800 active:bg-green-500 font-medium text-white px-4 py-2 rounded-md text-center'
						>
							Transfer
						</button>
					</div>
					{showPopup && (
						<TransferPopup
							message={popupMessage}
							onClose={() => {
								setShowPopup(false);
								navigate('/qcr');
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default QcUpdate;
