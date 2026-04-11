/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { saveTextUpdate } from "../api/textUpdate";
import DropDownButton from "./DropDownButton";

const EditPopup = ({
  onClose,
  onSave,
  zNumber,
  initialShortText,
  initialLongText,
  initialPlnGrp,
  initialPriorty,
  initialSelectedOption 
}) => {
  const [shortInputValue, setShortInputValue] = useState(initialShortText);
  const [longInputValue, setLongInputValue] = useState(initialLongText);
  const [plannerGroup, setPlannerGroup ] = useState(initialPlnGrp);
  const [priority, setPriority] = useState(initialPriorty);
  const [checkboxChecked, setCheckboxChecked] = useState(""); 
  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);

  console.log("Priority",initialPriorty)
  console.log("Option", initialSelectedOption)

  const handleOptionChange = (option) => {
		setPriority(option);
	};
  const handleCheckboxChange = (isChecked) => {
		setCheckboxChecked(isChecked);
	};

  const handleShortInputChange = (event) => {
    const value = event.target.value;
    if (value.length <= 40) {
      setShortInputValue(value);
    }
  };

  const handleLongInputChange = (event) => {
    const value = event.target.value;
    if (value.length <= 500) {
      setLongInputValue(value);
    }
  };

  

  const handleSave = async () => {
    try {
      const access_token = localStorage.getItem("access_token");

      if (!priority) {
        alert("Priority is null. please select priority.");
        return;
      }
      const response = await saveTextUpdate(
        zNumber,
        shortInputValue,
        longInputValue,
        access_token,
        priority,
        checkboxChecked,
        plannerGroup
      );
      
      console.log(response);
      onSave(shortInputValue, longInputValue, plannerGroup, priority, checkboxChecked, selectedOption);
      console.log("Passing These")
      console.log(shortInputValue, longInputValue, plannerGroup, priority, checkboxChecked)
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white w-[500px] p-6 rounded-md'>
        <h2 className='mb-4 text-2xl font-bold text-center'>
          Edit Details of {zNumber}
        </h2>
        <div>
        <label htmlFor="">Description</label>
        <input
          type='text'
          value={shortInputValue}
          onChange={handleShortInputChange}
          className='w-full px-3 py-2 mb-4 rounded-md custom-border'
          placeholder='Short Text (Max 40 characters)'
        />
        </div>
        <div>
        <label htmlFor="">Deatils of Description</label>
        <textarea
          value={longInputValue}
          onChange={handleLongInputChange}
          className='w-full px-3 py-2 mb-4 border-gray-300 rounded-md custom-border'
          rows='4'
          placeholder='Long Text (Max 500 characters)'
        />
        </div>
       <div>
       <label>Planner Group </label>
        <select
								value={plannerGroup} // Set the default value to the value of plannerGroup
								onChange={(e) => setPlannerGroup(e.target.value)} // Handle change event to update plannerGroup state
								className='border border-[#b4ed47] w-44 py-1 mx-2 h-8 p-[2px] rounded-md pr-20'
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
      <div className="py-3"><label htmlFor="">Prioity</label>
              <DropDownButton selectedOption={priority}
								handleOptionChange={handleOptionChange}
								onCheckboxChange={handleCheckboxChange} /></div>
        <div className='flex my-4 space-x-4'>
          <button
            className='flex-1 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className='flex-1 px-4 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400'
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
