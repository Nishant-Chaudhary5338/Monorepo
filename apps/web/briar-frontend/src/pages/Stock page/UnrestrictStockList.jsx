import React, { useEffect, useState } from 'react';
import LogoutButton from '../../small-components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import StockReportForm from './StockReportForm';
import { encode } from 'js-base64';
import { getStockHelp } from '../../api/stockHelp';
import useAccess, { Stock_Transf_Access } from '../../hooks/useAccess';
import NotFoundPage from '../not found/NotFoundPage';
import HomeButton from '../../small-components/HomeButton';
import { getUnrestrictStockReport } from '../../api/UnrestrictStockReport';
import { stockTransfer } from '../../api/stockTransfer';
import TransferPopup from '../../small-components/TransferPopup';

import LoadingSpinner from '../../small-components/LoadingSpinner';

const UnrestrictStockList = () => {
  const [reportData, setReportData] = useState([]);
  const [sortedField, setSortedField] = useState('material');
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [reloadComponent, setReloadComponent] = useState(false);
  const [filters, setFilters] = useState({
    storageLocation: '',
    materialGroup: '',
  });

  const handleDataReceived = (response) => {
    setReportData(response);
    console.log('response passed to list', response);
  };

  const getStockList = async () => {
    try {
      const data = await getUnrestrictStockReport();
      const stockReport = data.ZCDS_QC_UNRESTRICTType;
      setReportData(stockReport);
      setLoading(false);
      console.log(stockReport);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getStockList();
  }, []);

  const formatStockQty = (stockQty) => {
    let numberValue = parseFloat(stockQty);
    if (!isNaN(numberValue)) {
      return numberValue.toFixed(2);
    } else {
      return stockQty;
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value.toLowerCase(), // Convert the filter value to lowercase
    });
  };

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortedField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortedField(field);
    setSortDirection(direction);
  };

  const sortedData = reportData.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortedField] > b[sortedField] ? 1 : -1;
    } else {
      return a[sortedField] < b[sortedField] ? 1 : -1;
    }
  });


  const handleStockTransfer = async (item) => {
    try {
      setLoading(true);

      const user = localStorage.getItem('user');
      const useremail = localStorage.getItem('useremail');
      const data = {
        ZHEAD: {
          MATERIAL: item.matnr,
          PLANT: item.werks,
          STGE_LOC: item.lgort,
          BATCH: item.charg,
          MOVE_STLOC: item.lgort,
          MOVE_BATCH: item.charg,
          ENTRY_QNT: item.unrestrict,
          MV_TYPE: '344',
          ZNAME: useremail,
        },
      };

      console.log('Transfer data:', data);

      const response = await stockTransfer(data);

      const results = response?.['n0:ZMB_GOODS_MOVEMENTResponse']?.['RET'] || {};

      for (const key in results) {
        if (results.hasOwnProperty(key) && results[key] !== '') {
          console.log(results[key]);
          setShowPopup(true);
          setPopupMessage(results[key]);
          getStockList();
          setReloadComponent(prevState => !prevState);
          
        }
      }
    } catch (error) {
      console.error('Error transferring stock:', error);
      alert('Error transferring stock');
    } finally {
      setLoading(false);
      
    }
  };
  

  const filteredData = sortedData.filter((item) => {
    const storageLocationMatch = filters.storageLocation
      ? item.lgort.toLowerCase().includes(filters.storageLocation) // Convert data value to lowercase for comparison
      : true;
    const materialGroupMatch = filters.materialGroup
      ? item.matnr.toLowerCase().includes(filters.materialGroup) // Convert data value to lowercase for comparison
      : true;
    return storageLocationMatch && materialGroupMatch;
  });

  return (
    <div>
      <div className='bg-[#71a311] text-xl px-2 h-12 flex items-center justify-between'>
        <HomeButton />
        <h1 className='font-semibold text-white'>Unrestricted Stock List</h1>
        <LogoutButton />
      </div>
      {loading ? (
        <LoadingSpinner text='Loading...' />
      ) : (
        <div className='mx-2 mb-10'>
          <div className='flex justify-center py-2 mb-4 space-x-6 text-center'>
            <input
              type='text'
              placeholder='Filter by Storage Location'
              name='storageLocation'
              value={filters.storageLocation}
              onChange={handleFilterChange}
              className='px-2 py-1 rounded-md custom-border'
            />
            <input
              type='text'
              placeholder='Filter by Material'
              name='materialGroup'
              value={filters.materialGroup}
              onChange={handleFilterChange}
              className='px-2 py-1 rounded-md custom-border'
            />
          </div>
          {filteredData.length > 0 ? (
            <table className='w-full mt-4 text-center border-collapse table-fixed'>
              <thead>
                <tr className='text-xs'>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('werks')}>
                    Plant
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('matnr')}>
                    Material
                  </th>
                  <th width="300px" className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('maktx')}>
                    Description
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('unrestrict')}>
                    Quantity
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('charg')}>
                    Batch No
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('lgort')}>
                    Storage Location
                  </th>
                  
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('unitOfMeasure')}>
                    UOM
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr
                    key={index}
                    className='hover:bg-[#b4ed47] text-xs font-semibold'
                  >
                    <td className='custom-border'>{item.werks}</td>
                    <td className='custom-border'>{item.matnr}</td>
                    <td className='custom-border'>{item.maktx}</td>
                    <td className='custom-border'>{formatStockQty(item.unrestrict)}</td>
                    <td className='custom-border'>{item.charg}</td>
                    <td className='custom-border'>{item.lgort}</td>
                    <td className='custom-border'>{item.unitOfMeasure}</td>
                    <td className='custom-border'>
                      <div className='py-1 space-x-2 text-center'>
                        <button
                          onClick={() => handleStockTransfer(item)}
                          className='px-4 py-2 font-medium text-center text-white bg-blue-500 rounded-md hover:bg-blue-800 active:bg-green-500'
                        >
                          Block
                        </button>
                       
                      </div>
                      {showPopup && (
                        <TransferPopup
                          message={popupMessage}
                          onClose={() => setShowPopup(false)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className='py-4 text-center'>No data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UnrestrictStockList;
