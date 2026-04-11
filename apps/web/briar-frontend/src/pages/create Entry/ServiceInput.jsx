/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import DropDownButton from '../../small-components/DropDownButton';
import { PiMagnifyingGlassDuotone } from 'react-icons/pi';
import { LiaSave } from 'react-icons/lia';
import { createServiceEntry } from '../../api/serviceEntry';
import SuccessPopup from '../../small-components/SuccessPopup';
import ErrorPopup from '../../small-components/ErrorPopup';
import SearchPopup from '../../small-components/SearchPopup';
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import FunctionalLocationPopup from '../../small-components/FunctionalLocationPopup';
import FilterSearchPopup from '../../small-components/FilterSearchPopup';
import EquipmentHelp from '../../small-components/EquipmentHelp';
import PhysicalLocationPopup from '../../small-components/PhysicalLocationPopup';
import PlantSectionpopup from '../../small-components/PlantSectionpopup';
import LoadingSpinner from '../../small-components/LoadingSpinner';

const ServiceInput = () => {
	const [callNumber, setCallNumber] = useState('');
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [selectedOption, setSelectedOption] = useState(null);
	const [shortDesc, setShortDesc] = useState('');
	const [equipmentNo, setEquipmentNo] = useState('');
	const [showSuccessPopup, setShowSuccessPopup] = useState(false);
	const [notificationNo, setNotificationNo] = useState('');
	const [errorPopup, setErrorPopup] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [searchPopup, setSearchPopup] = useState(false);
	const [checkboxChecked, setCheckboxChecked] = useState(false);
	const [functionalLocation, setFunctionalLocation] = useState('');
	const [plannerGroup, setPlannerGroup] = useState([]);
	const [detailsOfDescription, setDetailsOfDescription] = useState('');
	const [equipmentDesc, setEquipmentDesc] = useState('');
	const [filterSearchPopup, setFilterSearchPopup] = useState(false);
	const [functionalLocationPopup, setFunctionalLocationPopup] = useState(false);
	const [savedText, setSavedText] = useState('');
	const [plantSection, setPlantSection] = useState('');
	const [physicalLoc, setPhysicalLoc] = useState('');
    const [equipmentHelpPopup, setEquipmentHelpPopup] = useState(false);
	const [plantSectionPopup, setPlantSectionPopup] = useState(false);
	const [physicalLocationPopup, setPhysicalLocationPopup] = useState(false);
	const [loading, setLoading] = useState(false);
	const [notificationType, setNotificationType] = useState('P1');


	const resetForm=()=>{
		setSelectedOption('');
		setCallNumber('');
		setEquipmentNo('');
		setShortDesc('');
		setSavedText('');
		setStartDate('');
		setStartTime('');
		setEndDate('');
		setEndTime('');
		setFunctionalLocation('');
		setPlantSection('')
		setEquipmentNo('');
		setEquipmentDesc('');
		setPlannerGroup('');
		setPhysicalLoc('');
		setShortDesc('');
		setDetailsOfDescription('');

	}


	const handleCheckboxChange = (isChecked) => {
		setCheckboxChecked(isChecked);
	};
	const handleSelectEquipment = (equipmentNo) => {
		setEquipmentNo(equipmentNo); // Set the equipment number in the state of the parent component
	};

	const handleSelectFunctionalLocation = (functionalLocation) => {
		setFunctionalLocation(functionalLocation);
		setPhysicalLoc(null);
		setPlantSection(null);
	};

	const handleSelectPhysicalLocation = (physicalLoc) => {
		setPhysicalLoc(physicalLoc);
		setFunctionalLocation(null);
		setPlantSection(null);
	};

	const handleSelectPlantSection = (plantSection) => {
		setPlantSection(plantSection);
		setPhysicalLoc(null);
		setFunctionalLocation(null);
	};

	const handleSelectPlannerGroup = (plannerGroup) => {
		setPlannerGroup(plannerGroup);
	};

	const handleSelectEquimentDesc = (equipmentDesc) => {
		setEquipmentDesc(equipmentDesc);
	};

	const handleSearchOpenPopup = () => {
		setSearchPopup(true);
	};

	const handleFilterSearchOpenPopup = () => {
		setFilterSearchPopup(true);
	};
	const handleFilterSearchClosePopup = () => {
		setFilterSearchPopup(false);
	};

	const handleFunctionalLocationPopup = () => {
		setFunctionalLocationPopup(true);
	};
	const handleCloseFunctionalLocationPopup = () => {
		setFunctionalLocationPopup(false);
	};

	const handleEquipmentHelpPopup = () => {
		setEquipmentHelpPopup(true);
		setFunctionalLocation(null);
		setPlantSection(null);
		setPhysicalLoc(null);
	};

	const handleCloseEquipmentHelpPopup = () => {
		setEquipmentHelpPopup(false);
	};

	const handleSearchClosePopup = () => {
		setSearchPopup(false);
	};

	const handleChange = (e) => {
		setShortDesc(e.target.value);
	};

	//  create entry call
	const handleSendResponse = () => {
		const createdBy = localStorage.getItem('user');
		if (
			!selectedOption ||
			!equipmentNo ||
			!startDate ||
			!startTime ||
			!endDate ||
			!endTime ||
			!shortDesc ||
			!plannerGroup
		) {
			// If any of the necessary fields are missing, show an error message and return
			setErrorMessage('Please fill in all the required fields.');
			setErrorPopup(true);
			return;
		}

		const useremail = localStorage.getItem('useremail');

		const data = {
			Header: {
				Breakdown: checkboxChecked,
				CreatedBy: createdBy,
				Zmail : useremail,
				ServiceType: notificationType,
				Priority: selectedOption,
				MatCode: '',
				CallStat: callNumber,
				EquipNo: equipmentNo,
				ZendD: endDate,
				ZendT: endTime,
				GenDesc1: shortDesc,
				GenDesc: detailsOfDescription,
				PlanGrp: plannerGroup,
				FuncLoc: functionalLocation,
				CrDate: startDate,
				CrTime: startTime,
			},
		};
		setLoading(true);
		createServiceEntry(data)
			.then((response) => {
				setLoading(false)
				if (response.success && response.notificationNo) {
					setNotificationNo(response.notificationNo);
					setShowSuccessPopup(true);
					resetForm();
				} else {
					setLoading(false);
					setErrorMessage(response.error);
					setErrorPopup(true);
				}
			})
			.catch((error) => {
                setLoading(false);
				setErrorMessage('API request failed');
				setErrorPopup(true);
			});
	};
	const handleCloseSuccessPopup = () => {
		setShowSuccessPopup(false);
	};

	const handleCloseErrorPopup = () => {
		setErrorPopup(false);
	};

	const handleOptionChange = (option) => {
		setSelectedOption(option);
	};

	return (
		<div>
			<div className='sm:flex 2xl:mx-[10%] 2xl:text-lg justify-between'>
				<div className=''>
				
					<div className='my-4 '>
						<div className='flex items-center space-x-10'>
						<label className='text-sm font-semibold text-gray-700 w-28 space-x-6'>Notification Type:</label>
						{['P1', 'P7'].map((type) => (
							<label key={type} className='inline-flex items-center space-x-2'>
							<input
								type='radio'
								name='notificationType'
								value={type}
								checked={notificationType === type}
								onChange={(e) => setNotificationType(e.target.value)}
							/>
							<span>{type}</span>
							</label>
						))}
						</div>
						

						<div className='flex items-center space-x-6'>
							<span className='text-sm font-semibold text-gray-700 w-28'>
								Priority
							</span>

							<DropDownButton
								selectedOption={selectedOption}
								handleOptionChange={handleOptionChange}
								onCheckboxChange={handleCheckboxChange}
							/>
						</div>
					
					</div>
					
					<div className='flex items-center my-4 space-x-6'>
						<div className='flex items-center my-4 space-x-6'>
							<label className='text-sm font-semibold text-gray-700 w-28' htmlFor='time'>
								Start Time
							</label>
							<input
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
								className='rounded-md custom-border'
								type='time'
							/>
						</div>
						<div className='flex items-center my-4 space-x-6'>
							<label className='text-sm font-semibold text-gray-700 w-28' htmlFor='time'>
								End Time
							</label>
							<input
								value={endTime}
								onChange={(e) => setEndTime(e.target.value)}
								className='rounded-md custom-border'
								type='time'
							/>
						</div>
					</div>

					<div className='flex items-center my-4 space-x-6'>
						<div className='flex items-center my-4 space-x-6'>
							<label className='text-sm font-semibold text-gray-700 w-28' htmlFor='date'>
								Start Date
							</label>
							<input
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className='rounded-md custom-border'
								type='date'
							/>
						</div>
						<div className='flex items-center my-4 space-x-6'>
							<label className='text-sm font-semibold text-gray-700 w-28' htmlFor='date'>
								End Date
							</label>
							<input
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className='rounded-md custom-border'
								type='date'
							/>
						</div>
					</div>
					<div className='mt-10'>
						<h4 className='font-semibold text-md'>Equipment Help</h4>
						<div className='mt-4 space-y-4'>
							<div className='flex items-center mt-1 space-x-2'>
								<span className='mr-2 text-sm font-semibold text-gray-700 w-44'>
									Functional Location
								</span>
								<span className='border border-[#b4ed47] py-2 w-30 h-8 p-[2px] rounded-md pr-20'>
									{functionalLocation}
								</span>
								<button onClick={handleEquipmentHelpPopup}>
									<PiMagnifyingGlassDuotone
										size={30}
										color='#b4ed47'
										className='border p-[2px] border-[#b4ed47] rounded-md'
									/>
								</button>
								{equipmentHelpPopup && (
									<EquipmentHelp
										onClose={handleCloseEquipmentHelpPopup}
										onSelectFuncLoc={handleSelectFunctionalLocation}
										onSelectLoc={handleSelectPhysicalLocation}
										onSelectPlantSection={handleSelectPlantSection}
									/>
								)}
							</div>
							<div className='flex items-center mt-1 space-x-2'>
								<span className='mr-2 text-sm font-semibold text-gray-700 w-44'>
									Plant Section
								</span>
								<span className='border border-[#b4ed47] py-2 w-30 h-8 p-[2px] rounded-md pr-20'>
									{plantSection}
								</span>
								<button
									onClick={() => {
										setPlantSectionPopup(true);
										setFunctionalLocation(null);
										setPlantSection(null);
										setPhysicalLoc(null);
									}}
								>
									<PiMagnifyingGlassDuotone
										size={30}
										color='#b4ed47'
										className='border p-[2px] border-[#b4ed47] rounded-md'
									/>
								</button>
								{plantSectionPopup && (
									<PlantSectionpopup
										onClose={() => setPlantSectionPopup(false)}
										onSelectPlantSection={(plantSection) =>
											setPlantSection(plantSection)
										}
									/>
								)}
							</div>
							<div className='flex items-center mt-1 space-x-2'>
								<span className='mr-2 text-sm font-semibold text-gray-700 w-44'>
									Physical Location
								</span>
								<span className='border border-[#b4ed47] py-2 w-30 h-8 p-[2px] rounded-md pr-20'>
									{physicalLoc}
								</span>
								<button
									onClick={() => {
										setPhysicalLocationPopup(true);
										setFunctionalLocation(null);
										setPlantSection(null);
										setPhysicalLoc(null);
									}}
								>
									<PiMagnifyingGlassDuotone
										size={30}
										color='#b4ed47'
										className='border p-[2px] border-[#b4ed47] rounded-md'
									/>
								</button>

								{physicalLocationPopup && (
									<PhysicalLocationPopup
										onClose={() => setPhysicalLocationPopup(false)}
										onSelectFuncLoc={(physicalLoc) =>
											setPhysicalLoc(physicalLoc)
										}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
				<div>
					<h4 className='font-semibold text-md'>Equipment Information:</h4>
					<div className='mt-4 space-y-2'>
						<div className='flex space-x-4'>
							<span className='text-sm font-semibold text-gray-700 w-44'>
								Equipment Number
							</span>
							<input
								value={equipmentNo}
								onChange={(e) => setEquipmentNo(e.target.value)}
								className='border border-[#b4ed47] py-2 p-[2px] rounded-md pr-16'
							></input>

							{/*New FILTERED SEARCH HELP */}
							<div className='flex items-center space-x-1'>
								<button onClick={handleFilterSearchOpenPopup}>
									<PiMagnifyingGlassDuotone
										size={30}
										color='#b4ed47'
										className='border p-[2px] border-[#b4ed47] rounded-md'
									/>
								</button>
								{/* Render the SearchPopup */}
								{filterSearchPopup && (
									<FilterSearchPopup
										onClose={handleFilterSearchClosePopup}
										onSelectEquipment={handleSelectEquipment}
										onSelectFunctionalLocation={handleSelectFunctionalLocation}
										onSelectPlannerGroup={handleSelectPlannerGroup}
										onSelectEquipmentDesc={handleSelectEquimentDesc}
										functionalLocation={functionalLocation}
										plantSection={plantSection}
										physicalLoc={physicalLoc}
									/>
								)}
							</div>
						</div>

						<div className='flex items-center mt-1 space-x-2'>
							<span className='mr-2 text-sm font-semibold text-gray-700 w-44'>
								Equipment Description
							</span>
							<span className='border border-[#b4ed47] w-60 py-2 h-20 p-[2px] rounded-md pr-20'>
								{equipmentDesc}
							</span>
						</div>
						<div className='flex items-center mt-1 space-x-2'>
							<span className='mr-2 text-sm font-semibold text-gray-700 w-44'>
								Planner Group
							</span>
							<select
								value={plannerGroup} // Set the default value to the value of plannerGroup
								onChange={(e) => setPlannerGroup(e.target.value)} // Handle change event to update plannerGroup state
								className='border border-[#b4ed47] w-44 py-1 h-8 p-[2px] rounded-md pr-20'
							>
								<option value={plannerGroup}>{plannerGroup}</option>{' '}
								{/* Default value */}
								<option value='N01'>N01 Mechanical</option>
								<option value='N02'>N02 North Site</option>
								<option value='N03'>N03 Infrastructure</option>
								<option value='N04'>N04 Facilities</option>
								<option value='N06'>N06 E, I & C</option>
								<option value='N08'>N08 PPE Consumables</option>
								<option value='N09'>N09 Operational</option>
								<option value='N11'>N11 Contractor</option>
								<option value='N12'>N12 Workshop</option>
								<option value='N13'>N13 Civils</option>
							</select>
						</div>

						<div className='flex items-center space-x-2 text-sm font-semibold text-gray-700'>
							<span className='mr-2 text-sm font-semibold text-gray-700 w-44'>
								Description
							</span>
							<textarea
								onChange={handleChange}
								value={shortDesc}
								rows='3'
								cols='30'
								maxLength='40'
								placeholder='char limit 40 '
								className='border rounded-md border-[#b4ed47] focus:outline-none focus:ring-[#b4ed47] focus:border-[#b4ed47]'
							/>
							{
								<div className='flex items-center space-x-2'>
									{showSuccessPopup && (
										<SuccessPopup
											notificationNo={notificationNo}
											onClose={handleCloseSuccessPopup}
										/>
									)}
									{errorPopup && (
										<ErrorPopup
											message={errorMessage}
											onClose={handleCloseErrorPopup}
										/>
									)}
								</div>
							}
						</div>
						<div className='flex items-center space-x-2 text-sm font-semibold text-gray-700'>
							<span className='mr-2 text-sm font-semibold text-gray-700 w-44'>
								Details of Description{' '}
							</span>
							<textarea
								onChange={(e) => setDetailsOfDescription(e.target.value)}
								value={detailsOfDescription}
								rows='6'
								cols='30'
								maxLength='500'
								placeholder='char limit 500 '
								className='border rounded-md border-[#b4ed47] focus:outline-none focus:ring-[#b4ed47] focus:border-[#b4ed47]'
							/>
						</div>
					</div>
				</div>
			</div>
			<div className='flex justify-center'>
			{loading ? (
                        <LoadingSpinner text='Loading...' />
                    ) : (
				<div
					onClick={handleSendResponse}
					className='flex items-center active:bg-blue-400 text-white rounded-md font-semibold rounde-md px-2 py-1  space-x-1 bg-[#71a311]'
				>
					<p>Save</p>
					<LiaSave
						size={30}
						color='white'
						className='bg-[#71a311] p-1 rounded-full'
					/>
				</div>
					)}
			</div>
		</div>
	);
};

export default React.memo(ServiceInput);

