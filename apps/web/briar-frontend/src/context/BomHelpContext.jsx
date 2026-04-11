/* eslint-disable react/prop-types */
// DataContext.js
import React, { createContext, useState } from 'react';

const BomHelpContext = createContext();

const BomHelpProvider = ({ children }) => {
	const [data, setData] = useState(null);

	const bomData = (newData) => {
		setData(newData);
	};

	return (
		<BomHelpContext.Provider value={{ data, bomData }}>
			{children}
		</BomHelpContext.Provider>
	);
};

export { BomHelpContext, BomHelpProvider };
