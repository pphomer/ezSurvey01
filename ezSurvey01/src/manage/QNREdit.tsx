import React, { useEffect } from 'react'
import { useParams } from "react-router-dom";
import { QNRContextProvider } from '../common/useHooks/QNRContext'
import { useAppDispatch, useAppSelector } from '../Util/app/hooks'
import { fetchQNR, initCodeValues, selectErrors, selectQNRObj, selectStatus } from './manageSlice'
import 'react-datepicker/dist/react-datepicker.css';
import QNRProps from './QNRProps'
import { useForm } from './useHooks/useForm'
import RightButtons from './components/RightButtons'
import { useViewState, ViewStateProvider } from './useHooks/useViewState'
import { QNRQuests } from './QNRQuests'
import "./QNREdit.css"

export default function QNREdit() {
  const dispatch = useAppDispatch();
  const manageStatus = useAppSelector(selectStatus)
  const errors = useAppSelector(selectErrors)
  const QNRObj = useAppSelector(selectQNRObj)
  const formObj = useForm(QNRObj);
  const loaded = manageStatus === 'succeeded';
  const activeQuest = useViewState();

  const { qnrid } = useParams();

  useEffect(() => {
    if (manageStatus === 'idle') {
      dispatch(initCodeValues())
      dispatch(fetchQNR(qnrid))
    }
  }, [manageStatus])


  let statusMessage = <div className="loader">Loading...</div>;

  if (manageStatus === 'loading') {
    statusMessage = <div className="loader">Loading...</div>
  } else if (manageStatus === 'error') {
    statusMessage = <div>{JSON.stringify(errors)}</div>
  }

  console.log("QNREdit", formObj, QNRObj);

  if (!loaded) return statusMessage;

  return (
    <div>
      <ViewStateProvider value={activeQuest}>
        <QNRContextProvider value={formObj}>
          <div id="QNREdit" className="wrapper">
            <div className="leftContent">
              <div className="qnrProps"><QNRProps /></div>
              <div className="questList"><QNRQuests /></div>
            </div>
            <div className="rightToolBar right-sticky"><RightButtons /></div>
          </div>
        </QNRContextProvider>
      </ViewStateProvider>
    </div>
  )
}
