import React, { useContext } from 'react'


export const RecordContext = React.createContext({});
export const useRecordContext = () => useContext(RecordContext) as any;




