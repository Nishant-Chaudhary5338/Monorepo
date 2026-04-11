/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getStockReport } from "../../api/stockReport"; // Path to your API module
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import StockHelp from "../../small-components/StockHelp";
import { getStockHelp } from "../../api/stockHelp";
import StockHelp3 from "../../small-components/StockHelp3";
import StockHelp2 from "../../small-components/StockHelp2";
import NotFoundPage from "../not found/NotFoundPage";
import useAccess, { Stock_Transf_Access } from "../../hooks/useAccess";
import LoadingSpinner from "../../small-components/LoadingSpinner";

const StockReportForm = ({ onDataReceived }) => {
  const [material, setMaterial] = useState("");
  const [matGrp, setMatGrp] = useState("");
  const [stgeLoc, setStgeLoc] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupVisible2, setPopupVisible2] = useState(false);
  const [popupVisible3, setPopupVisible3] = useState(false);
  const [helpData, setHelpData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await getStockReport(material, matGrp, stgeLoc);
      console.log("API REQUEST SENT", material, matGrp, stgeLoc);
      const response = data.ZV_MB52_BRType;
      onDataReceived(response);
      console.log(response);
    } catch (error) {
      console.error(error);
      console.log("API REQUEST SENT", material, matGrp, stgeLoc);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPopup = () => {
    setPopupVisible(true);
    console.log("clicked");
  };

  const handleOpenPopup2 = () => {
    setPopupVisible2(true);
  };

  const handleOpenPopup3 = () => {
    setPopupVisible3(true);
  };

  const handleStockHelp = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      const data = await getStockHelp(access_token);
      const response = data.ZV_MB52_BR_HELPType;
      console.log(response);
      setHelpData(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleStockHelp();
  }, []);

  const handleSelectMaterial = (material) => {
    setMaterial(material);
  };
  const handleSelectMaterialGroup = (matGrp) => {
    setMatGrp(matGrp);
  };
  const handleSelectStorageLocation = (stgeLoc) => {
    setStgeLoc(stgeLoc);
  };

  return (
    <div className=''>
      <div className='my-10'>
        <form
          className='flex items-center mx-10 space-x-10 '
          onSubmit={handleSubmit}
        >
          <div className='flex items-center space-x-2'>
            <label htmlFor='material'>Material:</label>
            <input
              id='material'
              type='text'
              placeholder='Material'
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className='custom-border rounded-md px-3 py-1 w-full'
            />
            <div onClick={handleOpenPopup}>
              <PiMagnifyingGlassDuotone
                size={30}
                color='#b4ed47'
                className='border p-[2px] border-[#b4ed47] rounded-md cursor-pointer'
              />
            </div>
            {popupVisible && (
              <StockHelp
                isOpen={popupVisible}
                onClose={() => setPopupVisible(false)}
                data={helpData}
                onSelectMaterial={handleSelectMaterial}
                onSelectMaterialGroup={handleSelectMaterialGroup}
                onSelectStorageLocation={handleSelectStorageLocation}
              />
            )}
          </div>
          <div className='flex items-center space-x-2'>
            <label htmlFor='matGrp'>Group:</label>
            <input
              id='matGrp'
              type='text'
              placeholder='Material Group'
              value={matGrp}
              onChange={(e) => setMatGrp(e.target.value)}
              className='custom-border rounded-md px-3 py-1 w-full'
            />
            <div onClick={handleOpenPopup2}>
              <PiMagnifyingGlassDuotone
                size={30}
                color='#b4ed47'
                className='border p-[2px] border-[#b4ed47] rounded-md cursor-pointer'
              />
            </div>
            {popupVisible2 && (
              <StockHelp2
                isOpen={popupVisible2}
                onClose={() => setPopupVisible2(false)}
                data={helpData}
                onSelectMaterialGroup={handleSelectMaterialGroup}
                onSelectStorageLocation={handleSelectStorageLocation}
              />
            )}
          </div>
          <div className='flex items-center space-x-2'>
            <label htmlFor='stgeLoc'>Location:</label>
            <input
              id='stgeLoc'
              type='text'
              placeholder='Storage Location'
              value={stgeLoc}
              onChange={(e) => setStgeLoc(e.target.value)}
              className='custom-border rounded-md px-3 py-1 w-full'
            />

            <div onClick={handleOpenPopup3}>
              <PiMagnifyingGlassDuotone
                size={30}
                color='#b4ed47'
                className='border p-[2px] border-[#b4ed47] rounded-md cursor-pointer'
              />
            </div>
            {popupVisible3 && (
              <StockHelp3
                isOpen={popupVisible3}
                onClose={() => setPopupVisible3(false)}
                data={helpData}
                onSelectStorageLocation={handleSelectStorageLocation}
              />
            )}
          </div>
          <button
            type='submit'
            className='py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600'
          >
            Execute
          </button>
        </form>
      </div>
      {loading && <LoadingSpinner text='Loading...' />}
    </div>
  );
};

export default StockReportForm;
