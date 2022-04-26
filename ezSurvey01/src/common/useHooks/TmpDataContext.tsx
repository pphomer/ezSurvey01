import React, { useContext } from 'react';

const TmpDataContext = React.createContext({});

export default function useTmpData() { return useContext(TmpDataContext) };

export const TmpDataProvider = (props) => {
  return (
    <TmpDataContext.Provider value={props.datas}>
      {props.children}
    </TmpDataContext.Provider>
    )
}



