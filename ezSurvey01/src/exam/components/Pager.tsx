import React from "react";
import { useAppDispatch, useAppSelector } from "../../Util/app/hooks";
import { selectAllRecords, updateExam } from "../examSlice";
import { useParams } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";


export const Pager = () => {
  const { qnrid, examid } = useParams();
  const dispatch = useAppDispatch();
  const records = useAppSelector(selectAllRecords);
  
  const handleClick = async () => {
    const _examid = examid || nanoid();
    const exam = { qnrid, examid: _examid, records }

    try {
      await dispatch(updateExam({ qnrid, exam })).unwrap();

      alert("存檔完成");

      location.href = `/exam/${qnrid}/list`;
    }
    catch (ex) {
      console.log("updateExam ex", ex);
    }
    
  }

  return (
    <section className="submit d-flex justify-content-end">
        <button onClick={handleClick} className="btn btn-primary">提交</button>
    </section>
  )
}
