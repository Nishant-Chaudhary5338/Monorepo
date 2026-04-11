/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
// BomSearchPopup.jsx
import React, { useState, useEffect } from 'react';
import { PiMagnifyingGlassDuotone } from 'react-icons/pi';
import LoadingSpinner from './LoadingSpinner';
import { getFunctionalLocation } from '../api/functionalLocation';

const FunctionalLocationPopup = ({ onClose, onSelectFuncLoc }) => {
	const [loading, setLoading] = useState(true);
	const [selectedFuncLoc, setselectedFuncLoc] = useState(null);
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

	const handleRowClick = (tplnr) => {
		setselectedFuncLoc(tplnr);
		onSelectFuncLoc(tplnr);
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
				className='bg-white h-3/4 w-[400px] p-6 rounded-md'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='flex justify-end'></div>
				<h2 className='text-2xl font-bold mb-4'>Select Functional Location</h2>
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
									{filteredData.map((item) => {
										return (
											<tr
												key={item.tplnr}
												className={`cursor-pointer table-fixed  hover:bg-[#b4ed47] ${
													selectedFuncLoc === item.tplnr
														? 'border border-[#b4ed47]'
														: ''
												}`}
												onClick={() => handleRowClick(item.tplnr)}
											>
												<td className='border items-center py-1 text-center border-[#b4ed47] px-4'>
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

export default FunctionalLocationPopup;
