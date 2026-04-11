import React, { useState } from 'react';

const StatusFilterDropdown = ({ statusFilter, setStatusFilter, handleCheckboxChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOutsideClick = (event) => {
        if (event.target.closest('.status-filter-dropdown') === null) {
            setIsOpen(false);
        }
    };

    const handleCheckbox = (e) => {
        handleCheckboxChange(e);
    };

    return (
        <div className="relative inline-block text-left status-filter-dropdown" onBlur={handleOutsideClick}>
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border rounded-md custom-border hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                    id="statusFilter"
                    aria-haspopup="true"
                    aria-expanded={isOpen ? 'true' : 'false'}
                    onClick={toggleDropdown}
                >
                    Select Status
                    <svg
                        className="w-5 h-5 ml-2 -mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M7.293 8.293a1 1 0 011.414 0L10 10.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
            {isOpen && (
                <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {['Created', 'Approved by Supervisor', 'Rejected by Supervisor', 'Closed', 'Completed'].map((status) => (
                            <label
                                key={status}
                                className="flex items-center justify-start px-4 py-2 text-sm leading-5 text-gray-700"
                            >
                                <input
                                    type="checkbox"
                                    value={status}
                                    checked={statusFilter.includes(status)}
                                    onChange={handleCheckbox}
                                    className="w-4 h-4 transition duration-150 ease-in-out form-checkbox"
                                />
                                <span className="ml-2">{status}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatusFilterDropdown;
