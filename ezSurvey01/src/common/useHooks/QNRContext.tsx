import React, { useContext } from 'react';

const QNRContext = React.createContext({});

export default function useQNRContext() { return useContext(QNRContext) as any };

export const QNRContextProvider = ({ value, children }) => {
  return (
    <QNRContext.Provider value={value}>
      {children}
    </QNRContext.Provider>
    )
}



