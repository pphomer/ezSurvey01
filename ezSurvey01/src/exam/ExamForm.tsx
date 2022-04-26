import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../Util/app/hooks';
import { useParams } from "react-router-dom";
import { fetchExam, selectExam, selectStatus } from './examSlice';
import { ExamBody, ExamHeader } from './ExamView';
import { fetchQNR, selectQNRObj } from '../manage/manageSlice';

export const ExamForm = () => {
  const { qnrid, examid } = useParams();
  const dispatch = useAppDispatch()
  const exam = useAppSelector(selectExam)
  const examStatus = useAppSelector(selectStatus)
  const QNRObj = useAppSelector(selectQNRObj)
  
  useEffect(() => {
    if (examStatus === 'idle') {
      dispatch(fetchQNR(qnrid))
      dispatch(fetchExam({ qnrid, examid }))
    }
  }, [examStatus, dispatch])
   

  useEffect(() => {
    if (examStatus !== 'succeeded') return;

    if (exam.qnrid && QNRObj.qnrid) {
      if (examid && !exam.examid) {
        alert(`無問卷（${QNRObj.title}）-${examid} 填寫紀錄!`)
        const urlpath = location.pathname.split("/");
        urlpath.splice(-1, 1, "list");
        location.href = urlpath.join("/");
      }
    }
  }, [exam.qnrid, QNRObj.qnrid])

  //if (examStatus !== 'succeeded') {
  //  return <h1> 問卷載入中, 請稍候...</h1>
  //}

  return (<>
    {examStatus !== 'succeeded' ? <h1> 資料載入中, 請稍候...</h1> : ""}
    <ExamHeader />
    <ExamBody />
  </>)
}
