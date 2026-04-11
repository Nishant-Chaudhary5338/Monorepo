/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';

const DropDownButton = ({
	selectedOption,
	handleOptionChange,
	onCheckboxChange,
}) => {
	const [selectValue, setSelectValue] = useState(selectedOption || '');
	const [checkboxChecked, setCheckboxChecked] = useState(
		selectedOption === '1',
	);

	useEffect(() => {
		setSelectValue(selectedOption || '');
		setCheckboxChecked(selectedOption === '1');
	}, [selectedOption]);

	const handleDropdownChange = (event) => {
		const value = event.target.value;
		setSelectValue(value);
		handleOptionChange(value);
		if (value === '1') {
			setCheckboxChecked(true);
			onCheckboxChange('X');
		} else {
			setCheckboxChecked(false);
			onCheckboxChange('');
		}
	};

	const handleCheckboxToggle = () => {
		const newValue = !checkboxChecked;
		setCheckboxChecked(newValue);
		onCheckboxChange(newValue ? 'X' : '');
	};

	return (
		<div className='flex items-center space-x-2'>
			<div className='relative'>
				<select
					value={selectValue}
					onChange={handleDropdownChange}
					className='block appearance-none w-60 px-3 border border-[#b4ed47] bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-8'
				>
					<option value=''>Select an option</option>
					<option value='1'>P1-Emergency</option>
					<option value='2'>P2-Risk</option>
					<option value='3'>P3-Repair/Replace</option>
				</select>
				<div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
					<RiArrowDownSLine className='text-gray-500' />
				</div>
			</div>
			<div className='inline-flex items-center' onClick={handleCheckboxToggle}>
				<input
					type='checkbox'
					className='appearance-none w-4 h-4 border border-gray-400 rounded-sm checked:bg-blue-500 checked:border-transparent focus:outline-none'
					checked={checkboxChecked}
					readOnly
				/>
			</div>
			<span className=''>BreakDown Indicator</span>
		</div>
	);
};

export default React.memo(DropDownButton);
