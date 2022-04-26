import React, { useEffect, useState } from 'react';
import { useQuestContext } from '../question/Question';


const RadioTextReadOnly = ({ option }) => {
  const { id: opId, content, hasAppendText } = option
  
  const needAppendText = hasAppendText === "y";
  
  return (
    <div className="form-check">
      <input id={opId} type="radio" className="form-check-input shadow-none" checked={false} readOnly />
      <label htmlFor={opId} className="form-check-label">{content}</label>
      {needAppendText && <input type="text" className="ms-2" readOnly />}
    </div>
  )
}


function RadioGroupReadOnly() {
  const { quest: { options} } = useQuestContext()  
  return (
    <>{
      options?.map(option => <RadioTextReadOnly {...{ option }} key={option.id} />)
    }</>
  )
}

export default React.memo(RadioGroupReadOnly);
