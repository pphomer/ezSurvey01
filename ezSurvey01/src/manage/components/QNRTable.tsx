import React from 'react'
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../Util/app/hooks';
import { copyQNR, deleteQNR, fetchQNRList, selectQNRById, selectQNRIds } from '../manageSlice';

const QNRTHead = () => {
  return (
    <thead className="thead-light">
      <tr>
        <th className="col-auto">問卷名稱</th>
        <th className="col-2">開始~結束日期</th>
        <th className="col-3">功能</th>
      </tr>
    </thead>
  )
}

const QNRTRow = ({ qnrid}) => {
  const dispatch = useAppDispatch();  
  const { title, period } = useAppSelector(state => selectQNRById(state,  qnrid));
  
  console.log("QNRTRow ",  qnrid);

  const onDelete = async (event) => {
    event.preventDefault();
    if (window.confirm("將一併刪除所有使用者填答資料, 繼續執行??")) {
      const result = await dispatch(deleteQNR(qnrid)).unwrap()
      console.log("onDelete", result);
      result && dispatch(fetchQNRList());
    }
  }

  const onCopy = async (event) => {
    event.preventDefault();
    if (window.confirm("確定複製??")) {
      const result = await dispatch(copyQNR(qnrid)).unwrap();
      console.log("onCopy", result);
      // updateParams({ PageID: 1 })
      location.href = `/manage/edit/${result}`;       
    }
  }
    

  return (    
    <tr className="exam-excerpt">
      <td>
        <a href={`/exam/${qnrid}/list`} target="_blank" title="開新視窗" >{qnrid}. {title}</a></td>
      <td>{period}</td>      
      <td>
        <a href={`/manage/edit/${qnrid}`} className="btn btn-primary">編輯</a>
        <button className="btn btn-info ml-1" onClick={onCopy}>複製</button>
        <button className="btn btn-secondary ml-1" onClick={onDelete}>刪除</button>
        <div className="btn-group ml-1">
          <button className="btn btn-warning dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a href={`/manage1/edit/${ qnrid}`} className="dropdown-item">活動維護與稽催</a>
            <a href={`/Questionnaire?id=${ qnrid}`} className="dropdown-item">題目維護</a>
            <a href={`/exam/${qnrid}/${nanoid()}`} className="dropdown-item">預覽</a>
            <a href={`/SurveyResult/queryList/${ qnrid}`} className="dropdown-item">填答結果列表與抽獎</a>
            <a href={`/SurveyExport/${ qnrid}`} className="dropdown-item">匯出</a>
            <a href={`/Questionnaire?id=${ qnrid}`} className="dropdown-item">統計圖(冇)</a>
          </div>
        </div>
      </td>
    </tr>
  )
}


export default function QNRTable() {
  const QNRIds = useAppSelector(selectQNRIds);

  console.log("QNRTable ", QNRIds);

  return (
    <>
      <table className="table table-striped table-hover">
        <QNRTHead />
        <tbody>{QNRIds.map(qnrid => <QNRTRow key={qnrid} qnrid={qnrid} />)}</tbody>
      </table>
      {QNRIds.length === 0 ? <div>查無資料</div> : ""}
    </>
  )
}
