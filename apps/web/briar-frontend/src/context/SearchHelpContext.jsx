// DataContext.js
import React, { createContext, useState } from "react";

const SearchHelpContext = createContext();

const SearchHelpProvider = ({ children }) => {
  const [data, setData] = useState(null);

  const storeData = (newData) => {
    setData(newData);
  };

  return (
    <SearchHelpContext.Provider value={{ data, storeData }}>
      {children}
    </SearchHelpContext.Provider>
  );
};

export { SearchHelpContext, SearchHelpProvider };
