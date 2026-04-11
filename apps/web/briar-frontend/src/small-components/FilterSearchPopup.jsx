/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
// BomSearchPopup.jsx
import React, { useState, useEffect } from 'react';
import { PiMagnifyingGlassDuotone } from 'react-icons/pi';
import LoadingSpinner from './LoadingSpinner';
import { getFilterSearchHelp } from '../api/filterSearchHelp';

const FilterSearchPopup = ({
	onClose,
	onSelectEquipment,
	onSelectEquipmentDesc,
	onSelectPlannerGroup,
	onSelectFunctionalLocation,
	functionalLocation,
	plantSection,
	physicalLoc,
}) => {
	const [loading, setLoading] = useState(true);
	const [selectedEquipment, setSelectedEquipment] = useState(null);
	const [selectedEquipmentDesc, setSelectedEquipmentDesc] = useState(null);
	const [selectedPlannerGrp, setSelectedPlannerGrp] = useState(null);
	const [selectedFuncLoc, setSelectedFuncLoc] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [data, setData] = useState([]);

	const getFilterSearchHelpList = async () => {
		try {
			const accessToken = localStorage.getItem('access_token');
			const func_loc = functionalLocation;
			const beber = plantSection;
			const stort = physicalLoc;
			const response = await getFilterSearchHelp(
				accessToken,
				func_loc,
				beber,
				stort,
			);
			console.log(func_loc, beber, stort);

			// Check if response contains elements
			if (
				Array.isArray(response.znotifc_epqui_helpType) &&
				response.znotifc_epqui_helpType.length > 0
			) {
				// Response contains elements
				setData(response.znotifc_epqui_helpType);
				console.log(response.znotifc_epqui_helpType.length);
				setLoading(false);
			} else {
				// Response is empty or contains no elements
				setData([]);
				setLoading(false);
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		getFilterSearchHelpList();
	}, []);

	const handleRowClick = (equnr, funcation_location, plan_grp, eqktx) => {
		setSelectedEquipment(equnr);
		onSelectEquipment(equnr);
		setSelectedFuncLoc(funcation_location);
		onSelectFunctionalLocation(funcation_location);
		setSelectedPlannerGrp(plan_grp);
		onSelectPlannerGroup(plan_grp);
		setSelectedEquipmentDesc(eqktx);
		onSelectEquipmentDesc(eqktx);
		onClose();
	};

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const filteredData = data
		? data.filter(
				(item) =>
					item.Equnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.Eqktx.toLowerCase().includes(searchTerm.toLowerCase()),
		  )
		: [];

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
										<th className='w-1/6 px-4 border-[#b4ed47] border sticky top-0 bg-white z-10'>
											Number
										</th>
										<th className='w-3/6 px-4 border-[#b4ed47] border sticky top-0 bg-white z-10'>
											Description
										</th>
										<th className='w-1/4 px-4 border-[#b4ed47] border sticky top-0 bg-white z-10'>
											Functional Location
										</th>
										<th className='w-1/6 px-4 border-[#b4ed47] border sticky top-0 bg-white z-10'>
											Planner Group
										</th>
									</tr>
								</thead>

								<tbody>
									{filteredData.map((item) => {
										return (
											<tr
												key={item.Equnr}
												className={`cursor-pointer table-fixed  hover:bg-[#b4ed47] ${
													selectedEquipment === item.Equnr ||
													selectedEquipmentDesc === item.Eqktx ||
													selectedPlannerGrp === item.plan_grp ||
													selectedFuncLoc === item.funcation_location
														? 'border border-[#b4ed47]'
														: ''
												}`}
												onClick={() =>
													handleRowClick(
														item.Equnr,
														item.funcation_location,
														item.plan_grp,
														item.Eqktx,
													)
												}
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

export default FilterSearchPopup;
