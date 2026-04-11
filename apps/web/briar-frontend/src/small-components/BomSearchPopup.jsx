/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
// BomSearchPopup.jsx
import React, { useState, useEffect, useContext } from 'react';
import { PiMagnifyingGlassDuotone } from 'react-icons/pi';
import LoadingSpinner from './LoadingSpinner';
import { BomHelpContext } from '../context/BomHelpContext';

const BomSearchPopup = ({ onClose, onSelectEquipment }) => {
	const { data } = useContext(BomHelpContext); // Access data from the context
	const [loading, setLoading] = useState(true);
	const [selectedEquipment, setSelectedEquipment] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortedField, setSortedField] = useState('Equnr');
	const [sortDirection, setSortDirection] = useState('asc');
	//const [data, setData] = useState([]);
	// console.log("Context Data", data);
	/*const getBomEquipmentList = async () => {
		try {
			const accessToken = localStorage.getItem('access_token');
			const response = await getBomHelp(accessToken);
			setData(response);
			setLoading(false);
			console.log();
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};
	useEffect(() => {
		getBomEquipmentList();
	}, []);*/

	const handleRowClick = (equnr) => {
		setSelectedEquipment(equnr);
		onSelectEquipment(equnr);
		onClose();
	};

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSort = (field) => {
		let direction = 'asc';
		if (sortedField === field && sortDirection === 'asc') {
			direction = 'desc';
		}
		setSortedField(field);
		setSortDirection(direction);
	};

	const getSortIndicator = (field) => {
		if (sortedField !== field) return null;
		return sortDirection === 'asc' ? ' ▲' : ' ▼';
	};

	const filteredData = data
		? data.filter(
				(item) =>
					item.Equnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.Eqktx.toLowerCase().includes(searchTerm.toLowerCase()),
		  )
		: [];

	const sortedData = [...filteredData].sort((a, b) => {
		const rawA = a[sortedField] ?? '';
		const rawB = b[sortedField] ?? '';

		const numA = parseFloat(rawA);
		const numB = parseFloat(rawB);
		let comparison = 0;

		if (!Number.isNaN(numA) && !Number.isNaN(numB) && rawA !== '' && rawB !== '') {
			comparison = numA - numB;
		} else {
			const aVal = String(rawA).toLowerCase();
			const bVal = String(rawB).toLowerCase();
			if (aVal > bVal) comparison = 1;
			else if (aVal < bVal) comparison = -1;
			else comparison = 0;
		}

		return sortDirection === 'asc' ? comparison : -comparison;
	});

	console.log('Filtered Data', filteredData);
	console.log('Sorted Data', sortedData);

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
				className='bg-white h-3/4 w-[900px] p-6 rounded-md'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='flex justify-end'></div>
				<h2 className='text-2xl font-bold mb-4'>Select Equipment</h2>
				<div className='relative'>
					<input
						type='text'
						className='border border-[#b4ed47] rounded-md w-full p-2 pl-10'
						placeholder='Search Equipment'
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
										<th className='w-1/6 px-4 border-[#b4ed47] border sticky top-0 bg-white z-10 cursor-pointer hover:bg-[#b4ed47] hover:text-white' onClick={() => handleSort('Equnr')}>
											Number{getSortIndicator('Equnr')}
										</th>
										<th className='w-3/6 px-4 border-[#b4ed47] border sticky top-0 bg-white z-10 cursor-pointer hover:bg-[#b4ed47] hover:text-white' onClick={() => handleSort('Eqktx')}>
											Description{getSortIndicator('Eqktx')}
										</th>
										<th className='w-1/4 px-4 border-[#b4ed47] border sticky top-0 bg-white z-10 cursor-pointer hover:bg-[#b4ed47] hover:text-white' onClick={() => handleSort('funcation_location')}>
											Functional Location{getSortIndicator('funcation_location')}
										</th>
										<th className='w-1/6 px-4 border-[#b4ed47] border sticky top-0 bg-white z-10 cursor-pointer hover:bg-[#b4ed47] hover:text-white' onClick={() => handleSort('plan_grp')}>
											Planner Group{getSortIndicator('plan_grp')}
										</th>
									</tr>
								</thead>

								<tbody>
									{sortedData.map((item) => {
										return (
											<tr
												key={item.Equnr}
												className={`cursor-pointer table-fixed  hover:bg-[#b4ed47] ${
													selectedEquipment === item.Equnr
														? 'border border-[#b4ed47]'
														: ''
												}`}
												onClick={() => handleRowClick(item.Equnr)}
											>
												<td className='border  border-[#b4ed47] px-4'>
													{item.Equnr}
												</td>
												<td className='border border-[#b4ed47] px-4'>
													{item.Eqktx}
												</td>
												<td className='border border-[#b4ed47] px-4'>
													{item.funcation_location}
												</td>
												<td className='border border-[#b4ed47] px-4'>
													{item.plan_grp}
												</td>
											</tr>
										);
									})}
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

export default BomSearchPopup;
