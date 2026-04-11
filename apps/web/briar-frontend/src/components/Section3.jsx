import React, { useState } from "react";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import SquareRadioButton from "../small-components/SquareRadioButton";
import { LiaSave } from "react-icons/lia";
import { BiSolidPencil } from "react-icons/bi";
import Popup from "./Popup";
import axios from "axios";

const Section3 = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [savedText, setSavedText] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [equipmentNo, setEquipmentNo] = useState("");

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveText = (text) => {
    setSavedText(text);
  };

  const handleChange = (e) => {
    setShortDesc(e.target.value);
  };

  const handleSendResponse = () => {
    const url = "http://localhost:3002/api/service_entry";
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Basic UzAwMjQ1MTMxNTg6U2NfYmFua0AxMjM=",
    };

    const data = {
      Header: {
        CreatedBy: "p001",
        ServiceType: "p1",
        Priority: "1",
        MatCode: "",
        CallStat: "",
        EquipNo: equipmentNo,
        ZendD: "2019-01-01",
        ZendT: "15:33:45",
        GenDesc1: shortDesc,
        GenDesc: savedText,
      },
    };
    console.log(data);

    axios
      .post(url, data, { headers })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='space-y-2'>
      <h4 className='text-md font-semibold'>Equipment Information:</h4>
      <div className='space-y-2 mt-4'>
        <div className='space-x-4 flex'>
          <span>Equipment Number</span>
          <input
            value={equipmentNo}
            onChange={(e) => setEquipmentNo(e.target.value)}
            className='border border-[#b4ed47] p-[2px] rounded-md pr-16'
          ></input>
          <div className='flex items-center space-x-1'>
            <PiMagnifyingGlassDuotone
              size={30}
              color='#b4ed47'
              className='border p-[2px] border-[#b4ed47] rounded-md'
            />
          </div>
        </div>
        <div className='space-x-4 flex items-center'>
          <span>General Description</span>
          <textarea
            onChange={handleChange}
            value={shortDesc}
            maxLength='80'
            className='border border-[#b4ed47] focus:outline-none focus:ring-[#b4ed47] focus:border-[#b4ed47]'
          />
          <div className='flex items-center space-x-2'>
            <button className='' onClick={handleOpenPopup}>
              <BiSolidPencil />
            </button>

            {isPopupOpen && (
              <Popup onClose={handleClosePopup} onSave={handleSaveText} />
            )}

            <p>Save</p>
            <LiaSave
              size={30}
              color='white'
              className='bg-[#b4ed47] p-1 rounded-full'
              onClick={handleSendResponse}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section3;
