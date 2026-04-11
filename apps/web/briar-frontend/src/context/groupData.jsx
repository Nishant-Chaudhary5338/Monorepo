/* eslint-disable react/prop-types */
// GroupDataContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const GroupDataContext = createContext();

export const GroupDataProvider = ({ children }) => {
	const [groupData, setGroupData] = useState(() => {
		const storedData = localStorage.getItem('groupData');
		return storedData ? JSON.parse(storedData) : ['SWI-LB', 'SWI-QCA', 'SWI-EA', 'SWI-EB'];
	});

	useEffect(() => {
		localStorage.setItem('groupData', JSON.stringify(groupData));
	}, [groupData]);

	return (
		<GroupDataContext.Provider value={{ groupData, setGroupData }}>
			{children}
		</GroupDataContext.Provider>
	);
};

export const useGroupData = () => useContext(GroupDataContext);
