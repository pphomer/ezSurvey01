import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../Util/app/hooks';
import { recordUpdated } from '../examSlice';
import useCreateRecord from '../useHooks/useCreateRecord';
import { useRecordContext } from '../useHooks/useRecordContext';


const checkText = ({ questPId, option, record }) => {
  const dispatch = useAppDispatch();
  const { id: opId, content, hasAppendText } = option
  
  const [anstext, setAnstext] = useState("")
  const needAppendText = hasAppendText === "y";
  const [, , createAnswer] = useCreateRecord();

  const answer = record.fillList.filter(a => a.ansId === opId)[0];

  const textRef = useRef(null);
   
  useEffect(() => {
    setAnstext(answer?.ansText || "");
  }, [answer])


  const handleAnswerChanged = (ansId = opId, ansText = '') => {

    let fillList = record.fillList.filter(a => a.ansId !== opId);
    if (ansId === opId) {
      fillList = [...fillList, createAnswer(opId, ansText)]
    }

    const newRecord = { ...record, fillList }
    dispatch(recordUpdated(newRecord))
  }
  
  const onCheckChangeHandler = (event) => {
    const { checked } = event.target;
    
    if (checked) {
      textRef.current?.focus();
    }
    handleAnswerChanged(checked ? opId : '')
  }

  const onTextChangeHandler = (event) => {
    const { value } = event.target;
    setAnstext(value);
    if (!answer && value.trim().length > 0) {
      handleAnswerChanged(opId, value)
    } 
  }

  const onTextBlurHandler = (event) => {
    if (answer) {
      const { value } = event.target;
      handleAnswerChanged(opId, value)
    }
  }

  const ckid = `${questPId}-${opId}`;

  return (
    <div className="option">
    <div className="form-check">
      <input type="checkbox"
        className="form-check-input"
        id={ckid}
        value={opId}
        checked={answer != null}
        onChange={onCheckChangeHandler}
      />
      <label htmlFor={ckid} className="form-check-label">{content}</label>
      </div>
      {needAppendText &&
        <div>
          <input type="text" ref={textRef}
          value={anstext}
          onChange={onTextChangeHandler}
          onBlur={onTextBlurHandler}
      /></div>}
    </div>
  )
}

const CheckText = React.memo(checkText);


function CheckGroup() {
  const { quest, record } = useRecordContext();
  const { questPId, options } = quest;

  return (
    <div>{
      options.map(op => {
        const { id: opId } = op
        return <CheckText key={opId}
          questPId={questPId}
          option={op} record={record} />
      })
    }
    </div>
  )
}

export default React.memo(CheckGroup);