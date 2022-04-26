import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../Util/app/hooks';
import QNRTable from './components/QNRTable';
import { fetchQNRList, selectErrors, selectQNRIds, selectStatus } from './manageSlice';
import "./qnr.css"


export default function QNRList() {
  const dispatch = useAppDispatch();
  const manageStatus = useAppSelector(selectStatus)
  const errors = useAppSelector(selectErrors)

  const loaded = manageStatus === 'succeeded';

  useEffect(() => {
    if (manageStatus === 'idle') {
      dispatch(fetchQNRList())
    }
  }, [manageStatus])


  let statusMessage;

  if (manageStatus === 'loading') {
    statusMessage = <div className="loader">Loading...</div>
  } else if (manageStatus === 'error') {
    statusMessage = <div>{JSON.stringify(errors)}</div>
  }

  return (<>
    <div className="d-flex justify-content-between pe-3 ps-3">
      <span>{statusMessage}</span>
      <a href="/manage/edit/" className="btn btn-primary"> 新增問卷 </a>
    </div>
    {loaded ? <QNRTable /> : statusMessage}
  </>
  )
}



