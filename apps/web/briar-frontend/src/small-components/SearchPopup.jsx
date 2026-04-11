/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import { PiMagnifyingGlassDuotone } from 'react-icons/pi';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { SearchHelpContext } from '../context/SearchHelpContext';

const Row = ({ index, style, data }) => {
	const {
		onSelectEquipment,
		onSelectFunctionalLocation,
		onSelectPlannerGroup,
		onSelectEquipmentDesc,
		onClose,
	} = data;

	const item = data.filteredData[index];

	const handleRowClick = () => {
		onSelectEquipment(item.Equnr);
		onSelectFunctionalLocation(item.funcation_location);
		onSelectPlannerGroup(item.plan_grp);
		onSelectEquipmentDesc(item.Eqktx);
		onClose();
	};

	return (
		<div
			key={item.Equnr}
			style={{
				...style,
				cursor: 'pointer',
				backgroundColor: data.selectedEquipment === item.Equnr ? '#b4ed47' : '',
				border:
					data.selectedEquipment === item.Equnr ? '1px solid #b4ed47' : '',
				display: 'flex',
				borderBottom: '1px solid #b4ed47',
				alignItems: 'center',
			}}
			onClick={handleRowClick}
		>
			<div className='w-1/4 py-1  px-4'>{item.Equnr}</div>
			<div className='w-1/4 py-1 px-4'>{item.Eqktx}</div>
			<div className='w-1/4 py-1 px-4'>{item.funcation_location}</div>
			<div className='w-1/4 py-1 px-4'>{item.plan_grp}</div>
		</div>
	);
};

const SearchPopup = ({
	onClose,
	onSelectEquipment,
	onSelectFunctionalLocation,
	onSelectPlannerGroup,
	onSelectEquipmentDesc,
}) => {
	const { data } = useContext(SearchHelpContext);
	const [loading, setLoading] = useState(true);
	const [selectedEquipment, setSelectedEquipment] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const access_token = localStorage.getItem('access_token');
	const navigate = useNavigate();

	const handleRowClick = (equnr, funcation_location, plan_grp, eqktx) => {
		setSelectedEquipment(equnr);
		onSelectEquipment(equnr);
		onSelectFunctionalLocation(funcation_location);
		onSelectPlannerGroup(plan_grp);
		onSelectEquipmentDesc(eqktx);
		onClose();
	};

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	useEffect(() => {
		if (data && data.length > 0) {
			setLoading(false);
		}
	}, [data]);

	// Filter the data based on the search term
	const filteredData = data
		? data.filter(
				(item) =>
					item.Equnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.Eqktx.toLowerCase().includes(searchTerm.toLowerCase()),
		  )
		: [];
	const PaddingWrapper = ({ children }) => {
		return <div className='py-6'>{children}</div>;
	};

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
						<AutoSizer>
							{({ height, width }) => (
								<div className=''>
									<div className='w-[800px] font-semibold'>
										<div className='flex items-center text-center'>
											<div className='custom-border flex-1 px-4 '>Number</div>
											<div className='custom-border px-4 flex-1'>
												Description
											</div>
											<div className='custom-border px-4 flex-1 '>
												Functional Location
											</div>
											<div className='custom-border px-4 flex-1'>
												Planner Group
											</div>
										</div>
									</div>
									<List
										height={height - 20}
										itemCount={filteredData.length}
										itemSize={55}
										width={width}
										innerElementType={PaddingWrapper}
										itemData={{
											filteredData,
											selectedEquipment,
											onSelectEquipment,
											onSelectFunctionalLocation,
											onSelectPlannerGroup,
											onSelectEquipmentDesc,
											onClose,
											handleRowClick,
										}}
									>
										{Row}
									</List>
								</div>
							)}
						</AutoSizer>
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

export default SearchPopup;
