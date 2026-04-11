/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
// BomSearchPopup.jsx
import React, { useState, useEffect } from 'react';
import { PiMagnifyingGlassDuotone } from 'react-icons/pi';
import LoadingSpinner from './LoadingSpinner';
import { getFunctionalLocation } from '../api/functionalLocation';

const PhysicalLocationPopup = ({ onClose, onSelectFuncLoc }) => {
	const [loading, setLoading] = useState(true);
	const [selectedPhysicalLocation, setSelectedPhysicalLocation] =
		useState(null);
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

	const handleRowClick = (stort) => {
		setSelectedPhysicalLocation(stort);
		onSelectFuncLoc(stort);
		onClose();
	};

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const filteredData = data.filter((item) =>
		item.stort.toLowerCase().includes(searchTerm.toLowerCase()),
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
				className='bg-white h-3/4 w-[400px] p-6 rounded-md'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='flex justify-end'></div>
				<h2 className='text-2xl font-bold mb-4'>Select Physical Location</h2>
				<div className='relative'>
					<input
						type='text'
						className='border border-[#b4ed47] rounded-md w-full p-2 pl-10'
						placeholder='Search Location'
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
						<div style={{ maxHeight: '400px' }}>
							<table className='table-fixed w-full overflow-y-auto'>
								<thead>
									<tr>
										<th className=' w-1/4 px-4 border-[#b4ed47] border'>
											Physical Location
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredData
										.filter((item) => item.stort && item.stort.trim() !== '') // Filter out items where stort is not null or empty
										.reduce((uniqueItems, currentItem) => {
											// Use an array to keep track of unique values
											const stortKtext = `${currentItem.stort}_${currentItem.ktext}`;
											if (
												!uniqueItems.some(
													(item) => item.stortKtext === stortKtext,
												)
											) {
												uniqueItems.push({
													stort: currentItem.stort,
													ktext: currentItem.ktext,
												});
											}
											return uniqueItems;
										}, [])
										.filter(
											(item, index, array) =>
												array.findIndex(
													(i) =>
														i.stort === item.stort && i.ktext === item.ktext,
												) === index,
										) // Filter out duplicates
										.sort((a, b) => a.stort.localeCompare(b.stort)) // Sort alphabetically by stort
										.map((item, index) => (
											<tr
												key={index}
												className={`cursor-pointer   hover:bg-[#b4ed47] ${
													selectedPhysicalLocation === item.stort
														? 'border border-[#b4ed47]'
														: ''
												}`}
												style={{
													display: 'flex',
													alignItems: 'center',
												}} // Centering the row content
												onClick={() => handleRowClick(item.stort)}
											>
												<td
													className='py-1 px-6 cursor-pointer'
													style={{ textAlign: 'left' }}
												>
													{item.stort}
												</td>
												<td
													className='py-1 px-6 ml-10 cursor-pointer'
													style={{ textAlign: 'left' }}
												>
													{item.ktext}
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

export default PhysicalLocationPopup;
