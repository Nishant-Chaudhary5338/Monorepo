// BomPage.jsx
import React, { useState } from 'react';

import LogoutButton from '../../small-components/LogoutButton';
import HomeButton from '../../small-components/HomeButton';
import { PiMagnifyingGlassDuotone } from 'react-icons/pi';
import BomSearchPopup from '../../small-components/BomSearchPopup';
import { getBom } from '../../api/bom';
import LoadingSpinner from '../../small-components/LoadingSpinner';

const BomPage = () => {
	const [isPopupOpen, setPopupOpen] = useState(false);
	const [selectedEquipment, setSelectedEquipment] = useState(null);
	const [bomData, setBomData] = useState([]);
	const [loading, setLoading] = useState(false);

	const showResults = () => {
		setPopupOpen(true);
	};

	const closePopup = () => {
		setPopupOpen(false);
	};

	const handleSelectEquipment = async (equipmentNumber) => {
		setSelectedEquipment(equipmentNumber);
		setLoading(true);
	
		try {
			const accessToken = localStorage.getItem('access_token');
	
			const response = await getBom(accessToken, equipmentNumber);
			const responseData =
				response?.['ZCDS_BR_EQUIP_NO']?.['ZCDS_BR_EQUIP_NOType'];
	
			console.log('BOM DATA', responseData);
			if (!responseData) {
				setBomData([]);
				console.warn('No BOM data found');
				return; // Exit early if no data is available
			}
	
			let formattedData = [];
			if (Array.isArray(responseData)) {
				formattedData = responseData;
			} else if (typeof responseData === 'object') {
				formattedData = [responseData];
			}
	
			if (formattedData.length > 0) {
				console.log('Setting bomData:', formattedData);
				setBomData(formattedData);
			} else {
				console.log('No BOM data found');
				setBomData([]);
			}
		} catch (error) {
			console.error('Error fetching BOM data:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div className='bg-[#71a311] text-xl px-2 h-12 flex items-center justify-between'>
				<HomeButton />
				<h1 className='font-semibold text-white'>Bills of Material</h1>
				<LogoutButton />
			</div>
			<div className='flex justify-center my-4 space-x-4 items center'>
				<h3 className='text-xl font-semibold'>Select Equipment:</h3>
				<button onClick={showResults}>
					{' '}
					<PiMagnifyingGlassDuotone
						size={30}
						color='#b4ed47'
						className='border p-[2px] border-[#b4ed47] rounded-md'
					/>{' '}
				</button>
			</div>

			{loading ? (
				<div className='text-center'>
					<LoadingSpinner text='Loading BOM Data' />
				</div>
			) : bomData && bomData.length > 0 ? (
				<div className='mx-40 mb-10 text-center'>
					<h2 className='py-4 font-semibold text-md'>
						BOM Data for Equipment: {selectedEquipment}
					</h2>
					<table className='w-full overflow-y-auto text-center table-fixed'>
						<thead>
							<tr>
								<th className='w-1/4 px-4 py-3 border-[#b4ed47] border'>
									Material Number
								</th>
								<th className='w-1/4 px-4 py-3 border-[#b4ed47] border'>
									GP Code
								</th>
								<th className='w-1/2 px-4 py-3 border-[#b4ed47] border'>
									Description
								</th>
								<th className='w-1/4 px-4 py-3 border-[#b4ed47] border'>
									Storage Location
								</th>
								<th className='w-1/4 px-4 py-3 border-[#b4ed47] border'>
									Current Stock
								</th>
								<th className='w-1/4 px-4 py-3 border-[#b4ed47] border'>
									Storage Bin
								</th>
							</tr>
						</thead>
						<tbody>
							{bomData.map((item) => (
								<tr
									key={item?.Matnr}
									className={`cursor-pointer table-fixed  hover:bg-[#b4ed47] ${
										selectedEquipment === item.Equnr
											? 'border border-[#b4ed47]'
											: ''
									}`}
								>
									<td className='border w-1/3 py-1 border-[#b4ed47] px-4'>
										{item?.matnr}
									</td>
									<td className='border w-1/3 py-1 border-[#b4ed47] px-4'>
										{item?.bismt}
									</td>
									<td className='border w-1/3 py-1 border-[#b4ed47] px-4'>
										{item?.maktx}
									</td>
									<td className='border w-1/3 py-1 border-[#b4ed47] px-4'>
										{item?.lgort}
									</td>
									<td className='border w-1/3 py-1 border-[#b4ed47] px-4'>
										{item?.labst}
									</td>
									<td className='border w-1/3 py-1 border-[#b4ed47] px-4'>
										{item?.lgpbe}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p className='py-4 font-semibold text-center text-md'>
					{bomData.length === 0
						? 'No BOM data available for Equipment: ' + selectedEquipment
						: 'Loading BOM data failed'}
				</p>
			)}

			{isPopupOpen && (
				<BomSearchPopup
					onClose={closePopup}
					onSelectEquipment={handleSelectEquipment}
				/>
			)}
		</div>
	);
};

export default BomPage;
