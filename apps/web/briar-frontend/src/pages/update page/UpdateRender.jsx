/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";

import EditPopup from "../../small-components/EditPopup";


const UpdateRender = ({ data }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({ status: "", typ: "" });
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [zNumber, setZNumber] = useState(data?.ZitemNo);
  const [editedShortText, setEditedShortText] = useState(data?.Zdesc); // Initialize with original value
  const [editedLongText, setEditedLongText] = useState(data?.Desc2);
  const [editedPlannerGroup, setEditedPlannergroup] = useState("")
  const [editedPriority, setEditedPriority] = useState("")
 

  console.log(data?.ZitemNo);
  console.log(data);
  const Znumber = data?.ZitemNo;

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  console.log("PPPPPPPPPPPPP",editedPriority)

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
            {editedPriority || data?.Priority}
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
            { data?.PlanGrpName || "No data available" }
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
                setEditedPriority(priority);

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
          <span className='border border-[#b4ed47] rounded-md px-4 py-2 '>
            {editedLongText || data?.Desc2}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UpdateRender;
