"use client";
import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [username,setUsername] = useState({
    username: "",
  });

  return (
    <DataContext.Provider value={{ username,setUsername }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
