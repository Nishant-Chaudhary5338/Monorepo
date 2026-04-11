import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import LogoutButton from '../../small-components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import { getOutstandingReservations } from '../../api/outstandingReservations';
import { getOutstandingReservationsDetails } from '../../api/outstandingReservationsDetails';
import HomeButton from '../../small-components/HomeButton';
import LoadingSpinner from '../../small-components/LoadingSpinner';

const Reservations = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const navigate = useNavigate();

  const handleDataReceived = (response) => {
    setReportData(response);
    console.log('response passed to list', response);
  };

  const getOutstandingReservationsList = async () => {
    setLoading(true);
    setReportData([]); // Clear existing data
    try {
      const data = await getOutstandingReservations();
      setReportData(data.ZCDS_RESERVATION_VIEWType);
      setLastRefreshTime(new Date());
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOutstandingReservationsList();
    const interval = setInterval(getOutstandingReservationsList, 300000); // 300000 ms = 5 minutes
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  useEffect(() => {
    setFilteredData(
      reportData.filter(item =>
        Object.values(item)
          .join(' ')
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    );
  }, [searchText, reportData]);

  const openModal = async (item) => {
    console.log("Opening modal for item:", item);
    setSelectedItem(item);
    setIsModalOpen(true);
    setModalLoading(true); // Set modal loading to true
    try {
      const data = await getOutstandingReservationsDetails(item.rsnum);
      setModalData(data);
    } catch (error) {
      console.error('Error fetching reservation details:', error);
    }finally {
      setModalLoading(false); // Set modal loading to false after fetching data
    }
  };

  const closeModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalData(null);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const columns = [
    {
      name: 'Reservation Number',
      selector: (row) => row.rsnum,
      sortable: true,
    },
    {
      name: 'Reservation Date',
      selector: (row) => formatDate(row.bdter),
      sortable: true,
    },
    {
      name: 'Work Order No.',
      selector: (row) => row.aufnr,
      sortable: true,
    },
    {
      name: 'Work Order Type',
      selector: (row) => row.auart,
      sortable: true,
    },
    {
      name: 'Plant Section',
      selector: (row) => row.beber,
      sortable: true,
    },
    {
      name: 'Requested By',
      selector: (row) => row.ernam,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <input
          type="button"
          className="px-1 py-1 bg-red-500 text-white rounded-md  cursor-pointer"
          value="View"
          onClick={() => openModal(row)}
        />
      ),
    },
  ];

  return (
    <div>
      <div className='bg-[#71a311] text-xl px-2 h-12 flex items-center justify-between'>
        <HomeButton />
        <h1 className='font-semibold text-white'>Outstanding Reservations</h1>
        <LogoutButton />
      </div>
      {loading ? (
        <LoadingSpinner text='Loading...' />
      ) : (
        <div className='mx-2 mb-10'>
          <div className='flex justify-between items-center mb-4'>
            <div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 border border-gray-300 rounded-md"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className='text-gray-600'>
              Last refreshed: {lastRefreshTime ? formatDate(lastRefreshTime) + " " + formatTime(lastRefreshTime) : 'Fetching...'}
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            persistTableHead
          />
        </div>
      )}

{isModalOpen && (
  <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
    <div className='bg-white p-6 rounded-md w-full max-w-lg'>
      <h2 className='text-xl font-semibold mb-4'>Reservation Details</h2>
      {modalLoading ? (
        <div className='flex justify-center items-center'>
          <LoadingSpinner text='Loading details...' />
        </div>
      ) : (
        modalData && (
      <table className='w-full text-left border border-gray-300'>
        <tr className='bg-white border-b border-gray-300'>
          <td className='px-4 py-2 font-semibold'>Reservation Number:</td>
          <td className='px-4 py-2'>{modalData.rsnum}</td>
        </tr>
        <tr className='bg-gray-50 border-b border-gray-300'>
          <td className='px-4 py-2 font-semibold'>Reservation Date:</td>
          <td className='px-4 py-2'>{formatDate(modalData.bdter)}</td>
        </tr>
        <tr className='bg-white border-b border-gray-300'>
          <td className='px-4 py-2 font-semibold'>Work Order No.:</td>
          <td className='px-4 py-2'>{modalData.aufnr}</td>
        </tr>
        <tr className='bg-gray-50 border-b border-gray-300'>
          <td className='px-4 py-2 font-semibold'>Work Order Type:</td>
          <td className='px-4 py-2'>{modalData.auart}</td>
        </tr>
        <tr className='bg-white border-b border-gray-300'>
          <td className='px-4 py-2 font-semibold'>Plant Section:</td>
          <td className='px-4 py-2'>{modalData.beber}</td>
        </tr>
        <tr className='bg-gray-50 border-b border-gray-300'>
          <td className='px-4 py-2 font-semibold'>Requested By:</td>
          <td className='px-4 py-2'>{modalData.ernam}</td>
        </tr>
    
</table>
        )
      )}
      <button
        className='mt-4 px-4 py-2 bg-red-500 text-white rounded-md'
        onClick={closeModal}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Reservations;