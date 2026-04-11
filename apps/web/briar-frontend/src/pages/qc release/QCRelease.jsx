import React, { useState, useEffect } from 'react';
import LogoutButton from '../../small-components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../small-components/LoadingSpinner';
import TransferPopup from '../../small-components/TransferPopup';
import { getQualityControl } from '../../api/qualityContol';
import { stockTransfer } from '../../api/stockTransfer';
import HomeButton from '../../small-components/HomeButton';

const QCRelease = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [reloadComponent, setReloadComponent] = useState(false);
  const [filters, setFilters] = useState({
    storageLocation: '',
    materialGroup: '',
  });
  const [sortedField, setSortedField] = useState('matnr');
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();

  
    const fetchData = async () => {
      try {
        const value = "cinsm";
        const quality = await getQualityControl(value);
        const response = quality?.zcds_qc_inspectionType || []; // Default to empty array if no data
        setStockData(Array.isArray(response) ? response : [response]); // Ensure response is an array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quality control data:', error);
        setLoading(false);
      }
    };

    useEffect(()=> {
      fetchData();
    },[])

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value.toLowerCase(),
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

  const handleStockTransfer = async (item) => {
    try {
      setLoading(true);
      console.log('Stock Transfer:', item);

      const user = localStorage.getItem('user');
      const useremail = localStorage.getItem('useremail');

      const data = {
        ZHEAD: {
          MATERIAL: item.matnr,
          PLANT: 'UK21',
          STGE_LOC: item.lgort,
          BATCH: item.charg,
          MOVE_STLOC: item.lgort,
          MOVE_BATCH: item.charg,
          ENTRY_QNT: item.cinsm,
          MV_TYPE: '321',
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
          fetchData();
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
  const handleStockBlock = async (item) => {
    try {
      setLoading(true);
      console.log('Stock Transfer:', item);

      const user = localStorage.getItem('user');
      const useremail = localStorage.getItem('useremail');
      
      const data = {
        ZHEAD: {
          MATERIAL: item.matnr,
          PLANT: 'UK21',
          STGE_LOC: item.lgort,
          BATCH: item.charg,
          MOVE_STLOC: item.lgort,
          MOVE_BATCH: item.charg,
          ENTRY_QNT: item.cinsm,
          MV_TYPE: '350',
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
          
          setReloadComponent(prevState => !prevState);
        }
      }
    } catch (error) {
      console.error('Error transferring stock:', error);
      alert('Error transferring stock');
    } finally {
      setLoading(false);
      fetchData();
    }
  };

  const filteredData = stockData.filter((item) => {
    const storageLocationMatch = filters.storageLocation
      ? item?.storage_location?.toLowerCase().includes(filters.storageLocation)
      : true;
    const materialGroupMatch = filters.materialGroup
      ? item?.material_group?.toLowerCase().includes(filters.materialGroup)
      : true;
    return storageLocationMatch && materialGroupMatch;
  });

  const sortedData = filteredData.sort((a, b) => {
    const aValue = a[sortedField];
    const bValue = b[sortedField];

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div>
      <div className='bg-[#71a311] text-xl px-2 h-12 flex items-center justify-between'>
        <HomeButton/>
        <h1 className='font-semibold text-white'>QC Approve</h1>
        <LogoutButton />
      </div>
      {loading ? (
        <LoadingSpinner text='Loading...' />
      ) : (
        <div className='mx-2 mb-10'>
         
          {sortedData.length > 0 ? (
            <table className='w-full mt-4 text-center border-collapse table-fixed'>
              <thead>
                <tr className='text-xs'>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('matnr')}>
                    Material
                  </th>
                  <th className='w-3/12 custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('maktx')}>
                    Description
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('cinsm')}>
                    Quantity
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('charg')}>
                    Batch Number
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('lgort')}>
                    Storage Location
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('lgort')}>
                    Container No.
                  </th>
                  <th className='custom-border hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black' onClick={() => handleSort('unitOfMeasure')}>
                    Base Unit
                  </th>
                  <th className='custom-border w-2/12 hover:bg-[#b4ed47] hover:text-white active:bg-white active:text-black'>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr
                    key={index}
                    className='hover:bg-[#b4ed47] text-xs font-semibold'
                  >
                    <td className='custom-border'>{item.matnr}</td>
                    <td className='custom-border'>{item.maktx}</td>
                    <td className='custom-border'>{item.cinsm}</td>
                    <td className='custom-border'>{item.charg}</td>
                    <td className='custom-border'>{item.lgort}</td>
                    <td className='custom-border'>{item.idnlf}</td>
                    <td className='custom-border'>{item.unitOfMeasure}</td>
                    <td className='custom-border'>
                      <div className='py-1 space-x-2 text-center'>
                        <button
                          onClick={() => handleStockTransfer(item)}
                          className='px-4 py-2 font-medium text-center text-white bg-blue-500 rounded-md hover:bg-blue-800 active:bg-green-500'
                        >
                          Released
                        </button>
                        <button
                          onClick={() => handleStockBlock(item)}
                          className='px-4 py-2 font-medium text-center text-white bg-orange-400 rounded-md hover:bg-orange-800 active:bg-green-500'
                        >
                          Blocked
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
            <p className='py-4 text-center'>No stockData available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QCRelease;
