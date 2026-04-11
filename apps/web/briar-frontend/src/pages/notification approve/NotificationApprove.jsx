/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../../small-components/LogoutButton';
import LoadingSpinner from '../../small-components/LoadingSpinner';
import * as XLSX from 'xlsx';
import { FaFilter } from 'react-icons/fa';
import { FaSortAlphaDownAlt } from 'react-icons/fa';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { fetchNotificationData } from '../../api/notificationList';
import HomeButton from '../../small-components/HomeButton';
import useAccess, { Notif_Rep_Access } from '../../hooks/useAccess';
import NotFoundPage from '../not found/NotFoundPage';
import { BiReset } from 'react-icons/bi';
import { handleSort } from '../../utils/sortingUtils';
import { fetchCustomNotificationData } from '../../api/customNotifList';
import { GiOnTarget } from "react-icons/gi";
import StatusFilterDropdown from '../../components/StatusFilterDropdown';

const NotificationList = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [filteredData, setFilteredData] = useState([]);
	const [sortOrder, setSortOrder] = useState('asc');
	const [statusFilter, setStatusFilter] = useState([]);
	const [plannerGroupFilter, setPlannerGroupFilter] = useState('');
	const [plantSectionFilter, setPlantSectionFilter] = useState('');
	const [totalNotificationsFetched, setTotalNotificationsFetched] = useState(0);
	const [skip, setSkip] = useState(0);
	const [hasMoreData, setHasMoreData] = useState(false);
	


	const navigate = useNavigate();

	useEffect(() => {
		if (data === null) {
			setFilteredData([]); 
		} else if (data instanceof Array) {
			setFilteredData(data); 
		} else {
			setFilteredData([data]); 
		}
	}, [data]);

	const fetchData = async () => {
		try {
			const accessToken = localStorage.getItem('access_token');
			const reportedBy = localStorage.getItem('user').toUpperCase();
			const notificationData = await fetchNotificationData(
				accessToken,
				reportedBy,
			);
			setData(notificationData);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			
		}
	};
	useEffect(() => {
		fetchData();
	}, []);


	
    const fetchCustomData = async () => {
		try {
			const accessToken = localStorage.getItem('access_token');
			const reportedBy = localStorage.getItem('user').toUpperCase();
			setLoading(true);
	
			const notificationData = await fetchCustomNotificationData(
				accessToken,
				reportedBy,
				startDate,
				endDate,
				plannerGroupFilter,
				plantSectionFilter,
				statusFilter,
				skip  // Use skip directly here
			);
	
			// Append new data to existing data only when fetching next 100
			if (skip > 0) {
				setData(prevData => [...prevData, ...notificationData]);
			} else {
				setData(notificationData);
			}
	
			setTotalNotificationsFetched(notificationData.length);
			setHasMoreData(notificationData.length >= 100);
			setFilteredData(notificationData);
	
			setLoading(false);
		} catch (error) {
			setLoading(false);
			alert("API failed");
		}
	};
	
	const handleFetchNext = async () => {
		const newSkip = skip + 100; // Increment skip value immediately
		setSkip(newSkip); // Update skip state immediately
	
		try {
			await fetchCustomData(); // Call fetch function with updated skip value
		} catch (error) {
			// Handle error if needed
		}
	};
	
	
	
	
	  
	

	const formatDate = (dateString) => {
		const dateObj = new Date(dateString);
		return dateObj.toLocaleDateString();
	};

	const formatTime = (timeString) => {
		const timeObj = new Date(timeString);
		return timeObj.toLocaleTimeString();
	};

	const convertToISODate = (dateString) => {
		const parts = dateString.split('/');
		if (parts.length === 3) {
			return `${parts[2]}-${parts[0]}-${parts[1]}`;
		}
		return dateString;
	};

	const handleRowClick = (NotifNumber,statusText) => {
		// Call the fetchData function with the NotifNumber from the clicked row
		fetchData(NotifNumber);

		// Navigate to UpdateSection and pass NotifNumber as a URL parameter
		navigate(`/approve/${NotifNumber}/${statusText}`);
	};

	const handleApplyFilter = () => {
		
		const lowerCaseStatusFilter = statusFilter
			? statusFilter.toLowerCase()
			: '';
		
		
		const plannerGroupFilters = plannerGroupFilter
			? plannerGroupFilter.toLowerCase().split(' ')
			: [];
		
		
		const plantSectionFilters = plantSectionFilter
			? plantSectionFilter.toLowerCase().split(' ')
			: [];
	
		
		const filteredData = data.filter((item) => {
		
	
			
			const lowerCaseStatusText = item.statustext.toLowerCase();
			const lowerCasePlannerGroup = item.plan_grp.toLowerCase();
			const lowerCasePlantSection = item.plant_section.toLowerCase();
	
			
			const statusMatch =
				!statusFilter || lowerCaseStatusText === lowerCaseStatusFilter;
	
			
			const plannerGroupMatch =
				!plannerGroupFilter ||
				plannerGroupFilters.includes(lowerCasePlannerGroup);
	
			
			const plantSectionMatch =
				!plantSectionFilter ||
				plantSectionFilters.includes(lowerCasePlantSection);
	
			return (
				
				
				statusMatch &&
				plannerGroupMatch &&
				plantSectionMatch
			);
		});
	
		setFilteredData(filteredData);
	};

	const handleResetFilters = () => {
		
		setStatusFilter('');
		setPlannerGroupFilter('');
		setPlantSectionFilter('');
		setStartDate(null);
		setEndDate(null);

		
		setFilteredData(data);
	};

	const handleSortWrapper = (columnName) => {
		handleSort(
			columnName,
			filteredData,
			sortOrder,
			setFilteredData,
			setSortOrder,
		);
	};

	const formatExcelData = (data) => {
		
		const formattedData = data.map((item) => ({
			...item,
			Notification_Date: formatDate(item.Notification_Date),
			Notification_Time: formatTime(item.Notification_Time),
		}));
		return formattedData;
	};

	const handleDownloadExcel = () => {
		const fileName = 'filteredData.xlsx';
		const formattedData = formatExcelData(filteredData); 
		const worksheet = XLSX.utils.json_to_sheet(formattedData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		XLSX.writeFile(workbook, fileName);
	};
	

	const handleCheckboxChange = (e) => {
		const selectedStatus = e.target.value;
		if (statusFilter.includes(selectedStatus)) {
			setStatusFilter(statusFilter.filter(status => status !== selectedStatus));
		} else {
			setStatusFilter([...statusFilter, selectedStatus]);
		}
	};
	
	
	
	return (
		<div>
			
			<div className='h-12 bg-[#71a311] items-center flex justify-between px-4'>
				<HomeButton />
				<h1 className='text-2xl font-semibold text-white '>
					List of All Notifications Pending for Approval / Rejection
				</h1>
				<LogoutButton />
			</div>

			<div className='flex content-center justify-center mt-2'>
				<div className=''>
					<div className='flex items-center content-center justify-center space-x-4'>
					<input
						type='date'
						className='p-1 rounded-md custom-border'
						value={startDate}
						onChange={(e) => {setStartDate(e.target.value)
						setSkip(0)
					    setData([])
					}}
					/>
					<span className='mx-2'>to</span>
					<input
						type='date'
						className='p-1 rounded-md custom-border'
						value={endDate}
						onChange={(e) => {setEndDate(e.target.value)
						setSkip(0)
					    setData([])
					}}
					/>
					<StatusFilterDropdown
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        handleCheckboxChange={handleCheckboxChange}
                    />

					<input
						type='text'
						placeholder='Planner Group'
						className='p-1 rounded-md custom-border'
						value={plannerGroupFilter}
						onChange={(e) => setPlannerGroupFilter(e.target.value)}
					/>
					<input
						type='text'
						placeholder='Plant Section'
						className='p-1 rounded-md custom-border'
						value={plantSectionFilter}
						onChange={(e) => setPlantSectionFilter(e.target.value)}
					/>
					<button className='px-2 py-2 mr-10 items-center space-x-2  bg-[#b4ed47] text-white font-semibold rounded-md ml-2' 
					onClick={() => {
						setSkip(0);  // Update skip state to 0
						fetchCustomData();  // Call fetchCustomData function
					}}
					>
					<GiOnTarget size={20} />
					
					</button>
					
					<div>
					<button
						className='custom-border px-4 py-2 bg-[#b4ed47] text-white rounded-md ml-2'
						onClick={handleDownloadExcel}
					>
						<span>
							{' '}
							<RiFileExcel2Fill size={20} />
						</span>
					</button>
				</div>
				</div>
					
					
					
				</div>
				
			</div>

			{loading ? (
				<LoadingSpinner text='Loading...' />
			) : (
				<div className='m-1 my-10'>
					{filteredData && filteredData.length > 0 ? (
						<><table className='table-fixed w-full text-[9px] font-medium border-collapse border border-[#b4ed47]'>
								<thead>
									<tr>
										<th
											className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black'
											onClick={() => handleSortWrapper('Notification')}
										>
											Notification{' '}
										</th>
										<th
											className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black'
											onClick={() => handleSortWrapper('Reported_By')}
										>
											Reported By
										</th>
										<th
											className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black'
											onClick={() => handleSortWrapper('Equipment_number')}
										>
											Equipment No.
										</th>
										<th
											className='custom-border w-1/6 hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black'
											onClick={() => handleSortWrapper('equipment_desc')}
										>
											Equipment Description
										</th>
										<th
											className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black'
											onClick={() => handleSortWrapper('funn_loca')}
										>
											Functional Location{' '}
										</th>
										{/*	<th className='w-1/6 custom-border'>FL Description</th> */}
										<th
											className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black'
											onClick={() => handleSortWrapper('plan_grp')}
										>
											Planner Group
										</th>
										{/* 	<th className='w-1/6 custom-border'>Planner Group Name</th> */}
										<th
											className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black'
											onClick={() => handleSortWrapper('plant_section')}
										>
											Plant Section
										</th>
										<th className=' custom-border'>Status</th>

										<th className=' custom-border' onClick={() => handleSort('')}>
											Maintaince Order
										</th>
										<th className=' custom-border'>Date</th>
										<th className=' custom-border'>Time</th>
										<th className='w-1/6 custom-border'>Description</th>
										
										<th
											className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black'
											onClick={() => handleSortWrapper('activity_type')}
										>
											Activity Type
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredData.map((item) => (
										<tr
											key={item?.Notification}
											className='hover:bg-[#b4ed47] font-semibold text-center'
											onClick={() => handleRowClick(item?.Notification,item?.statustext)}
										>
											<td className='custom-border'>{item?.Notification}</td>
											<td className='custom-border'>{item?.Reported_By}</td>
											<td className='custom-border'>{item?.Equipment_number}</td>
											<td className='custom-border'>{item?.equipment_desc}</td>
											<td className='custom-border'>{item?.funn_loca}</td>
											{/* 	<td className='custom-border'>{item?.func_loca_Desc}</td> */}
											<td className='custom-border'>{item?.plan_grp}</td>
											{/*	<td className='custom-border'>{item?.plan_grp_name}</td> */}
											<td className='custom-border'>{item?.plant_section}</td>
											<td className='custom-border'>{item?.statustext}</td>

											<td className='custom-border'>{item?.manit_order}</td>
											<td className='custom-border'>
												{formatDate(item?.Notification_Date)}
											</td>
											<td className='custom-border'>
												{formatTime(item?.Notification_Time)}
											</td>
											<td className='custom-border'>{item?.Description}</td>
											<td className='custom-border'>{item?.activity_type}</td>
										</tr>
									))}
								</tbody>
							</table><div>
							
					

								</div></>
					) : (
						<p className='py-4 text-center'>No data available.</p>
					)}
				</div>

				
			)}
		</div>
	);
};

export default NotificationList;
