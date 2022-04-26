import React, { useEffect } from "react";
import { useAppDispatch } from "../../Util/app/hooks";
import { recordUpdated } from "../examSlice";
import useCreateRecord from "../useHooks/useCreateRecord";
import { useRecordContext } from "../useHooks/useRecordContext";


const useTextUpdate = () => {
  const dispatch = useAppDispatch();
  const { record } = useRecordContext();
  const [, , createAnswer] = useCreateRecord();
  const { ansText = '' } = record.fillList[0] || {};
  
  const updateText = (event) => {
    const { value } = event.target;
    dispatch(recordUpdated({ ...record, fillList: [createAnswer('', value)]}))
  }

  return [ansText, updateText];
}

const MultiLineText = () => {
  const [ansText, updateText] = useTextUpdate();

  return <textarea rows={3} className="w-100" value={ansText} onChange={updateText} placeholder="請輸入文字" />
}

export default React.memo(MultiLineText)
