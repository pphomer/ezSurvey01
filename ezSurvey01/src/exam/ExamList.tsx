import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../Util/app/hooks';
import { useParams } from "react-router-dom";
import { fetchExamList, selectExamList, selectStatus } from './examSlice';
import { fetchQNR } from '../manage/manageSlice';
import { ExamHeader } from './ExamView';

export default function ExamList() {
  const dispatch = useAppDispatch()
  const examStatus = useAppSelector(selectStatus)
  const examList = useAppSelector(selectExamList)
  const { qnrid } = useParams();

  useEffect(() => {
    if (examStatus === 'idle') {
      dispatch(fetchQNR(qnrid))
      dispatch(fetchExamList(qnrid))
    }
  }, [examStatus, dispatch])

  return (
    <>
      {examStatus !== 'succeeded' ? <h1> 資料載入中, 請稍候...</h1> : ""}
      <ExamHeader />
      <div className="d-flex justify-content-end pe-3 ps-3">
        <a href={`/exam/${qnrid}`} className="btn btn-primary">填寫新問卷</a>
      </div>
      <ol>
        {examList.map((e, index) => (<li key={e.updateDateString}><a href={`/exam/${qnrid}/${e.examid}`} target="_blank"> {e.updateDateString}</a></li>))}
      </ol>
    </>
  )
}
