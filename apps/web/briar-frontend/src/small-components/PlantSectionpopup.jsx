/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
// BomSearchPopup.jsx
import React, { useState, useEffect } from 'react';
import { PiMagnifyingGlassDuotone } from 'react-icons/pi';
import LoadingSpinner from './LoadingSpinner';
import { getFunctionalLocation } from '../api/functionalLocation';

const PlantSectionpopup = ({ onClose, onSelectPlantSection }) => {
	const [loading, setLoading] = useState(true);
	const [selectedPlantSection, setselectedPlantSection] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [data, setData] = useState([]);

	const getFunctionalLocationList = async () => {
		try {
			const accessToken = localStorage.getItem('access_token');
			const response = await getFunctionalLocation(accessToken);
			setData(response.znoti_func_loc_helpType);
			setLoading(false);
			console.log(response.znoti_func_loc_helpType);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};
	useEffect(() => {
		getFunctionalLocationList();
	}, []);

	const handleRowClick = (beber) => {
		setselectedPlantSection(beber);
		onSelectPlantSection(beber);
		onClose();
	};

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const filteredData = data.filter((item) =>
		item.tplnr.toLowerCase().includes(searchTerm.toLowerCase()),
	);
	console.log('Filtered Data', filteredData);

	useEffect(() => {
		// Set loading to false when data is available
		if (data && data.length > 0) {
			setLoading(false);
		}
	}, [data]);

	return (
		<div
			className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
			style={{ overflowY: 'auto' }}
		>
			<div
				className='bg-white h-3/4 w-[300px] p-6 rounded-md'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='flex justify-end'></div>
				<h2 className='text-2xl font-bold mb-4'>Select Plant Section</h2>
				<div className='relative'>
					<input
						type='text'
						className='border border-[#b4ed47] rounded-md w-full p-2 pl-10'
						placeholder='Search Plant Section'
						value={searchTerm}
						onChange={handleInputChange}
					/>
					<span className='absolute left-3 top-2'>
						<PiMagnifyingGlassDuotone size={18} color='#b4ed47' />
					</span>
				</div>
				<div style={{ overflowY: 'auto' }} className='bg-gray-50 h-3/4 mt-4'>
					{loading ? (
						<LoadingSpinner text='Loading...' />
					) : (
						<div style={{ maxHeight: '300px' }}>
							<table className='table-fixed w-full overflow-y-auto'>
								<thead>
									<tr>
										<th className=' w-1/4 px-4 border-[#b4ed47] border'>
											Plant Section
										</th>
									</tr>
								</thead>

								<tbody>
									{filteredData
										.filter((item) => item.beber && item.beber.trim() !== '') // Filter out items where stort is not null or empty
										.reduce((uniqueItems, currentItem) => {
											// Use an array to keep track of unique values
											const stortKtext = `${currentItem.beber}_${currentItem.fing}`;
											if (
												!uniqueItems.some(
													(item) => item.stortKtext === stortKtext,
												)
											) {
												uniqueItems.push({
													beber: currentItem.beber,
													fing: currentItem.fing,
												});
											}
											return uniqueItems;
										}, [])
										.filter(
											(item, index, array) =>
												array.findIndex(
													(i) => i.beber === item.beber && i.fing === item.fing,
												) === index,
										) // Filter out duplicates
										.sort((a, b) => a.beber.localeCompare(b.beber)) // Sort alphabetically by stort
										.map((item, index) => (
											<tr
												key={index}
												className={`cursor-pointer table-fixed text-center hover:bg-[#b4ed47] ${
													selectedPlantSection === item.beber
														? 'border border-[#b4ed47]'
														: ''
												}`}
												style={{
													display: 'flex',
													alignItems: 'center',
												}} // Centering the row content
												onClick={() => handleRowClick(item.beber)}
											>
												<td
													className='py-1 px-6 cursor-pointer'
													style={{ textAlign: 'left' }}
												>
													{item.beber}
												</td>
												<td
													className='py-1 px-6 cursor-pointer'
													style={{ textAlign: 'left' }}
												>
													{item.fing}
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					)}
				</div>
				<div className='flex justify-center mt-4'>
					<button
						className='px-4 py-2 bg-[#b4ed47] text-white rounded-md'
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default PlantSectionpopup;
