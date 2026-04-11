/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
// BomSearchPopup.jsx
import React, { useState, useEffect } from 'react';
import { PiMagnifyingGlassDuotone } from 'react-icons/pi';
import LoadingSpinner from './LoadingSpinner';
import { getFunctionalLocation } from '../api/functionalLocation';
import { uniqueId } from 'lodash';

const EquipmentHelp = ({
	onClose,
	onSelectFuncLoc,
	onSelectLoc,
	onSelectPlantSection,
}) => {
	const [loading, setLoading] = useState(true);
	const [selectedFuncLoc, setSelectedFuncLoc] = useState({
		value: null,
		header: null,
	});
	const [selectedLoc, setSelectedLoc] = useState({
		value: null,
		header: null,
	});
	const [selectedPlantSection, setSelectedPlantSection] = useState({
		value: null,
		header: null,
	});
	const [searchTerm, setSearchTerm] = useState('');
	const [data, setData] = useState([]);
	const uniqueKey = uniqueId();

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

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const filteredData = data.filter(
		(item) =>
			item.tplnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.beber.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.stort.toLowerCase().includes(searchTerm.toLowerCase()),
	);
	console.log('Filtered Data', filteredData);

	useEffect(() => {
		// Set loading to false when data is available
		if (data && data.length > 0) {
			setLoading(false);
		}
	}, [data]);

	const handleRowClick = (value, header) => {
		switch (header) {
			case 'Functional Location':
				onSelectFuncLoc(value);
				setSelectedFuncLoc({ value: value, header: header });
				setSelectedLoc(null);
				setSelectedPlantSection(null);
				break;
			case 'Plant Section':
				onSelectPlantSection(value);
				setSelectedPlantSection({ value: value, header: header });
				setSelectedFuncLoc(null);
				setSelectedLoc(null);
				break;
			case 'Location':
				onSelectLoc(value);
				setSelectedLoc({ value: value, header: header });
				setSelectedFuncLoc(null);
				setSelectedPlantSection(null);
				break;
			default:
				break;
		}
		onClose();
	};

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
				<h2 className='text-2xl font-bold mb-4'>Functional Location</h2>
				<div className='relative'>
					<input
						type='text'
						className='border border-[#b4ed47] rounded-md w-full p-2 pl-10'
						placeholder='Search Functional Location'
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
											Functional Location
										</th>
									</tr>
								</thead>

								<tbody>
									{filteredData
										.sort((a, b) => {
											// Sort alphabetically by 'tplnr' property
											return a.tplnr.localeCompare(b.tplnr);
										})
										// Filter out duplicate values
										.filter(
											(item, index, self) =>
												index === self.findIndex((t) => t.tplnr === item.tplnr),
										)
										.map((item, index) => {
											return (
												<tr key={index}>
													<td
														className={`border items-center py-1 text-center border-[#b4ed47] px-4 cursor-pointer ${
															selectedFuncLoc.value === item.tplnr ||
															selectedLoc.value === item.stort ||
															selectedPlantSection.value === item.beber
																? 'border border-[#b4ed47] hover:bg-[#b4ed47]'
																: 'hover:bg-[#b4ed47]'
														}`}
														onClick={() =>
															handleRowClick(item.tplnr, 'Functional Location')
														}
													>
														{item.tplnr}
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

export default EquipmentHelp;
