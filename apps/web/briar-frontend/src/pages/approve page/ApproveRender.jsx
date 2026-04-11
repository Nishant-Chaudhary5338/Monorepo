/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import StatusChangedPopup from "../../small-components/StatusChangedPopup";
import EditPopup from "../../small-components/EditPopup";
import { ApproveRejectEntry } from "../../api/approval-rejection";
import ConfirmationModal from "../../small-components/ConfirmationModal";

import { useNavigate } from "react-router-dom";
import useAccess, { Notif_Super_Access } from "../../hooks/useAccess";
import NotFoundPage from "../not found/NotFoundPage";

const ApproveRender = ({ data,statusText }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({ status: "", typ: "" });
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [zNumber, setZNumber] = useState(data?.ZitemNo);
  const [editedShortText, setEditedShortText] = useState(data?.Zdesc); // Initialize with original value
  const [editedLongText, setEditedLongText] = useState(data?.Desc2);
  const [editedPlannerGroup, setEditedPlannergroup] = useState("")
  const [editedPriority, setEditedPriority] = useState("")
  const [showInputs, setShowInputs] = useState(false)
  const [showMarkCompleted, setShowMarkCompleted] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState("")
  const Znumber = data?.ZitemNo;
  const navigate = useNavigate();
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  useEffect(() => {
    if (statusText !== "Created") {
      setShowInputs(true);
    }
    if (statusText == "Completed") {
      setShowInputs(true);
      setShowMarkCompleted(true);
    }
  }, [statusText]);


  const handleInputsOpenClick = () => {
    setShowInputs(true);
    setShowMarkCompleted(true);
  }

  const handleClick = async (statusInt) => {
   
    try {
      
      const access_token = localStorage.getItem("access_token");
      const useremail = localStorage.getItem('useremail');

       const response = await ApproveRejectEntry(
         Znumber,
         statusInt,
         access_token,
         date, 
         time,
         useremail
       );
      // Open the popup with the API response
      setPopupVisible(true);
      setPopupContent(response);
    } catch (error) {
      alert(error);
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    navigate("/approve");
  };

  const openConfirmationModal = (action) => {
    setActionToConfirm(action);
    setConfirmationModalVisible(true);
  };

  const handleConfirmAction = () => {
    if (actionToConfirm) {
      handleClick(actionToConfirm);
    }
    setConfirmationModalVisible(false);
  };

  return (
    <div className=''>
      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-semibold text-gray-700 w-28'>
            Notification No: 
          </span>
          <span className='border border-[#b4ed47] rounded-md px-4'>
            {data?.ZitemNo}
          </span>
        </div>

        <div className='flex items-center space-x-2'>
          <span className='text-sm font-semibold text-gray-700 w-28'>
            Equipment:
          </span>
          <span className='border border-[#b4ed47] rounded-md px-4'>
            {data?.EquipmentNo}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-semibold text-gray-700 w-28'>
            Priority:
          </span>
          <span className='border border-[#b4ed47] rounded-md px-4'>
          {editedPriority ||data?.Priority}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-semibold text-gray-700 w-28'>
            Start Date / Time:
          </span>
          <span className='border border-[#b4ed47] rounded-md px-4'>
            {data?.CreatedDate} / {data?.CreatedTime}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-semibold text-gray-700 w-28'>
            End Date / Time:
          </span>
          <span className='border border-[#b4ed47] rounded-md px-4'>
            {data?.ZendD} / {data?.ZendT}
          </span>
        </div>

        <div className='flex items-center space-x-2'>
          <span className='text-sm font-semibold text-gray-700 w-28'>
            Cost Centre:
          </span>
          <span className='border border-[#b4ed47] rounded-md px-4'>
            {data?.ZcostCentre}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-semibold text-gray-700 w-28'>
            Location:
          </span>
          <span className='border border-[#b4ed47] rounded-md px-4'>
            {data?.FunctLoc}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-semibold text-gray-700 w-28'>
            Planner Group:
          </span>
          <span className='border border-[#b4ed47] rounded-md px-4'>
          {editedPlannerGroup || data?.PlanGrp}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-semibold text-gray-700 w-28'>
            Planner Group Name:
          </span>
          <span className='border border-[#b4ed47] rounded-md px-4'>
            {data?.PlanGrpName || "No data available"}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-semibold text-gray-700 w-28'>
            Description:
          </span>
          <span className='border border-[#b4ed47] rounded-md px-4 py-2 min-w-[200px] whitespace-pre-wrap'>
            {editedShortText || data?.Zdesc}
          </span>

          <button
            onClick={() => setEditPopupVisible(true)}
            className='px-4 py-2 font-semibold text-white bg-orange-500 rounded-md'
          >
            Edit Details
          </button>
          {editPopupVisible && (
            <EditPopup
            onClose={() => setEditPopupVisible(false)}
            onSave={(shortText, longText, plannerGroup, priority) => {
              setEditedShortText(shortText);
              setEditedLongText(longText);
              setEditedPlannergroup(plannerGroup)
              setEditedPriority(priority)

            }}
            zNumber={zNumber}
            initialShortText={data?.Zdesc}
            initialLongText={data?.Desc2}
            initialPlnGrp={data?.PlanGrp}
            initialPriorty={data?.Priority}
          />
          )}
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-semibold text-gray-700 w-28'>
            Long Description:
          </span>
          <span className='border border-[#b4ed47] rounded-md px-4 py-2 min-w-[200px] whitespace-pre-wrap'>
            {editedLongText || data?.Desc2}
          </span>
        </div>
        <div className='flex pt-6 space-x-4 font-semibold text-white'>
          <button
          disabled={showInputs}
            className={`px-4 py-2 rounded-md ${showInputs ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500'}`}
            onClick={() => {
              openConfirmationModal("APP");
            }}
          >
            Approve Request
          </button>
          <button
  disabled={showInputs}
  className={`px-4 py-2 rounded-md ${showInputs ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500'}`}
  onClick={() => {
    handleClick("REJ");
  }}
>
  Reject Request
</button>

          {/*<button
            disabled={showMarkCompleted}
            className={`px-4 py-2 rounded-md ${showMarkCompleted ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'}`}
            onClick={handleInputsOpenClick} 
          >
            Mark Completed
          </button>*/}
       
        </div>
        {showInputs && !showMarkCompleted && (
          <div className="flex flex-col space-y-2">
            <h4 className="block text-center">Please Select Date and Time to confirm</h4>
            <div className="flex items-center justify-center">
            
              <label htmlFor="zDate">Date:</label>
              <input
                type="date"
                id="zDate"
                value={date}
                onChange={(e)=> setDate(e.target.value)}
                className="rounded-md custom-border"
              />
            </div>
            <div className="flex items-center justify-center">
              <label htmlFor="zTime">Time:</label>
              <input
  type="time"
  id="zTime"
  value={time}
  onChange={(e) => {
    const timeValue = e.target.value;
    setTime(`${timeValue}:00`);
  }}
  className="rounded-md custom-border"
/>

            </div>
            <div className="flex justify-center pt-4 space-x-2">
            <button 
  onClick={() => handleClick("COM")} // Provide a function reference
  className="px-4 py-2 text-white bg-blue-500 rounded-md"
>
  Mark Complete
</button>
<button onClick={()=>setShowInputs(false)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            </div>
          </div>
        )}
        {popupVisible && (
          <StatusChangedPopup
            onClose={handleClosePopup}
            statusResponse={popupContent}
          />
        )}
 
<ConfirmationModal
     isVisible={confirmationModalVisible}
     onClose={() => setConfirmationModalVisible(false)}
     onConfirm={handleConfirmAction}
     message={`Is the planner Group - ${data?.PlanGrpName || "N/A"} Correct?`}
   />
      </div>
    </div>
     
  );
};
export default ApproveRender;
