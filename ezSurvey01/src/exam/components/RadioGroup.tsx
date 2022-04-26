import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Util/app/hooks';
import { recordUpdated } from '../examSlice';
import { useRecordContext } from '../useHooks/useRecordContext';
import useCreateRecord from '../useHooks/useCreateRecord';

const RadioText = ({ name, option, record }) => {
  const dispatch = useAppDispatch();
  const { id: opId, content, hasAppendText } = option
  const { ansId, ansText } = record.fillList[0] || {};
  const [anstext, setAnstext] = useState("")
  const [, , createAnswer] = useCreateRecord();
  const isAnswer = opId == ansId;
  const needAppendText = hasAppendText === "y";
  const textRef = useRef(null);

  const handleAnswerChange = (ansText = '') => {
    const newRecord = { ...record, fillList: [createAnswer(opId, ansText)] }
    dispatch(recordUpdated(newRecord))
  }

  useEffect(() => {
    setAnstext(isAnswer ? (ansText || "") : "");
  }, [ansId, ansText])

  const onRadioChangeHandler = (event) => {
    textRef.current?.focus();
    handleAnswerChange()
  }

  const onTextChangeHandler = (event) => {
    const { value } = event.target;
    setAnstext(value);

    if (!isAnswer && value.trim().length > 0) {
      handleAnswerChange(value)
    }
  }

  const onTextBlurHandler = (event) => {
    if (isAnswer) {
      const { value } = event.target;
      handleAnswerChange(value)
    }
  }

  console.log("option", option);

  const ckId = `${name}${opId}`;

  return (
    <div className="option">
      <div className="form-check">
        <input type="radio"
          className="form-check-input shadow-none"
          id={ckId}
          name={name}
          value={opId}
          checked={isAnswer}
          onChange={onRadioChangeHandler}
        />
        <label htmlFor={ckId} className="form-check-label">{content}</label>
      </div>
      {needAppendText && 
        <div>
          <input type="text" ref={textRef}
            value={anstext}
            onChange={onTextChangeHandler}
            onBlur={onTextBlurHandler}
          /></div >}
    </div >
  )
}

function RadioGroup() {
  
  const { quest, record } = useRecordContext();
  const { questPId, questId, options } = quest;
  const name = `n_${questId}`
  
  if (!options) return <></>;

  return (
    <div>{
      options.map(op => {
        const { id } = op
        return (
          <RadioText key={id} name={name} record={record} option={op}/>
        )
      })
    }</div>
  )
}

export default React.memo(RadioGroup);
