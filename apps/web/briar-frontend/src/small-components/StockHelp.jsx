import React, { useState, useEffect } from "react";
import axios from "axios";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";

const StockHelp = ({
  onClose,
  onSelectMaterial,
  data,
  onSelectMaterialGroup,
  onSelectStorageLocation,
}) => {
  const [help, setHelp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setselectedMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterialGroup, setselectedMaterialGroup] = useState(null);
  const [selectedStorageLocation, setselectedStorageLocation] = useState(null);

  useEffect(() => {
    setHelp(data);
  }, [data]);

  const handleRowClick = (material, material_group, storage_location) => {
    setselectedMaterial(material);
    onSelectMaterial(material);
    setselectedMaterialGroup(material_group);
    onSelectMaterialGroup(material_group);
    setselectedStorageLocation(storage_location);
    onSelectStorageLocation(storage_location);
    onClose();
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter the data based on the search term
  const filteredData = help.filter(
    (item) =>
      item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material_desc.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    // Set loading to false when data is available
    if (help.length > 0) {
      setLoading(false);
    }
  }, [help]);

  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
      style={{ overflowY: "auto" }}
    >
      <div
        className='bg-white h-3/4 w-[500px] p-6 rounded-md'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-end'></div>
        <h2 className='text-2xl font-bold mb-4'>Select Material</h2>
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
        <div style={{ overflowY: "auto" }} className='bg-gray-50 h-3/4 mt-4'>
          {loading ? (
            <LoadingSpinner text='Loading...' />
          ) : (
            <div style={{ maxHeight: "300px" }}>
              <table className='table-fixed w-full text-xs overflow-y-auto'>
                <thead>
                  <tr>
                    <th className='w-1/4 px-4 border-[#b4ed47] border'>
                      Material
                    </th>
                    <th className='w-1/2 px-4 border-[#b4ed47] border'>
                      Description
                    </th>
                    <th className='w-1/4 px-4 border-[#b4ed47] border'>
                      Material Group
                    </th>
                    <th className='w-1/4 px-4 border-[#b4ed47] border'>
                      Storage Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      className={`cursor-pointer table-fixed  hover:bg-[#b4ed47] ${
                        selectedMaterial === item.material ||
                        selectedMaterialGroup === item.material_group ||
                        selectedStorageLocation === item.storage_location
                          ? "border border-[#b4ed47]"
                          : ""
                      }`}
                      key={index}
                      onClick={() =>
                        handleRowClick(
                          item.material,
                          item.material_group,
                          item.storage_location,
                        )
                      }
                    >
                      <td className='border w-1/4 border-[#b4ed47] px-4'>
                        {item.material}
                      </td>
                      <td className='border w-1/4 border-[#b4ed47] px-4'>
                        {item.material_desc}
                      </td>
                      <td className='border w-1/4 border-[#b4ed47] px-4'>
                        {item.material_group}
                      </td>
                      <td className='border w-1/4 border-[#b4ed47] px-4'>
                        {item.storage_location}
                      </td>
                    </tr>
                  ))}
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

export default StockHelp;

/*
import React, { useEffect, useState } from "react";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";

const StockHelp = ({ isOpen, onClose, data }) => {
  const [help, setHelp] = useState([]);
  useEffect(() => {
    setHelp(data);
  }, [data]);

  return (
    isOpen && (
      <div
        className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
        style={{ overflowY: "auto" }}
      >
        <div
          className='bg-white h-3/4 w-[500px] p-6 rounded-md'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex justify-end'></div>
          <h2 className='text-2xl font-bold mb-4'>Select Equipment</h2>
          <div className=''>
            <input
              type='text'
              className='border border-[#b4ed47] rounded-md w-full p-2 pl-10'
              placeholder='Search Equipment'
              value={{}}
              onChange={{}}
            />
            <span className='absolute left-3 top-2'>
              <PiMagnifyingGlassDuotone size={18} color='#b4ed47' />
            </span>
          </div>
          <div className='bg-white h-3/4 w-[500px] p-6 rounded-md'>
            <div
              style={{ overflowY: "auto" }}
              className='bg-gray-50 h-3/4 mt-4'
            >
              <div style={{ maxHeight: "300px" }}>
                <table className='table-fixed w-full text-xs overflow-y-auto'>
                  <thead>
                    <tr>
                      <th className='w-1/4 px-4 border-[#b4ed47] border'>
                        Material
                      </th>
                      <th className='w-1/2 px-4 border-[#b4ed47] border'>
                        Description
                      </th>
                      <th className='w-1/4 px-4 border-[#b4ed47] border'>
                        Material Group
                      </th>
                      <th className='w-1/4 px-4 border-[#b4ed47] border'>
                        Storage Location
                      </th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {help.map((item, index) => (
                      <tr key={index}>
                        <td className='border w-1/4 border-[#b4ed47] px-4'>
                          {item.material}
                        </td>
                        <td className='border w-1/4 border-[#b4ed47] px-4'>
                          {item.material_desc}
                        </td>
                        <td className='border w-1/4 border-[#b4ed47] px-4'>
                          {item.material_group}
                        </td>
                        <td className='border w-1/4 border-[#b4ed47] px-4'>
                          {item.storage_location}
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
      </div>
    )
  );
};

export default StockHelp;
*/
