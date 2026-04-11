import React, { useEffect, useState } from 'react';
import LogoutButton from '../../small-components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import StockReportForm from './StockReportForm';
import { encode } from 'js-base64';
import { getStockHelp } from '../../api/stockHelp';
import useAccess, { Stock_Transf_Access } from '../../hooks/useAccess';
import NotFoundPage from '../not found/NotFoundPage';
import HomeButton from '../../small-components/HomeButton';
import { getStockReport } from '../../api/stockReport';
import LoadingSpinner from '../../small-components/LoadingSpinner';

const StockList = () => {
  const [reportData, setReportData] = useState([]);
  const [sortedField, setSortedField] = useState('material');
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
      const data = await getStockReport();
      const stockReport = data.ZV_MB52_BRType;
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

  const filteredData = sortedData.filter((item) => {
    const storageLocationMatch = filters.storageLocation
      ? item.storage_location.toLowerCase().includes(filters.storageLocation) // Convert data value to lowercase for comparison
      : true;
    const materialGroupMatch = filters.materialGroup
      ? item.material_group.toLowerCase().includes(filters.materialGroup) // Convert data value to lowercase for comparison
      : true;
    return storageLocationMatch && materialGroupMatch;
  });

  return (
    <div>
      <div className='bg-[#71a311] text-xl px-2 h-12 flex items-center justify-between'>
        <HomeButton />
        <h1 className='font-semibold text-white'>Stock/Material List</h1>
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
              placeholder='Filter by Material Group'
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
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('material')}>
                    Material
                  </th>
                  <th className='w-3/12 custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('material_desc')}>
                    Material Description
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('material_group')}>
                    Material Group
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('batch')}>
                    Batch No
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('storage_location')}>
                    Storage Location
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('STOCK_QTY')}>
                    Quantity
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('base_unit')}>
                    Base Unit
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => navigate(`/stockUpdate/${encode(JSON.stringify(item))}`)}
                    className='hover:bg-[#b4ed47] text-xs font-semibold'
                  >
                    <td className='custom-border'>{item.material}</td>
                    <td className='custom-border'>{item.material_desc}</td>
                    <td className='custom-border'>{item.material_group}</td>
                    <td className='custom-border'>{item.batch}</td>
                    <td className='custom-border'>{item.storage_location}</td>
                    <td className='custom-border'>{formatStockQty(item.STOCK_QTY)}</td>
                    <td className='custom-border'>{item.base_unit}</td>
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

export default StockList;
