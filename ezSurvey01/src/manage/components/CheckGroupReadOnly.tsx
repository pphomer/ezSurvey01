import React from 'react';
import { useQuestContext } from '../question/Question';

const CheckTextReadOnly = ({ questPId, option }) => {

  //const { option_Pid, option_content, has_fillFld, right_ans} = option
  const { id: opId, content, hasAppendText } = option
  const needAppendText = hasAppendText === "y";

  const id = `${questPId}-${opId}`;

  return (
    <div className="form-check">
      <input id={id} type="checkbox" className="form-check-input" checked={false} readOnly />
      <label htmlFor={id} className="form-check-label">{content}</label>
      {needAppendText && <input type="text" className="ms-2" readOnly />}
    </div>
  )
}



function CheckGroupReadOnly() {
  const { quest } = useQuestContext()
  const { questPId, options } = quest;
  

  return (
    <div>{
      options?.map(option => <CheckTextReadOnly {...{ questPId, option }} key={option.id} />)
    }</div>
  )
}

export default React.memo(CheckGroupReadOnly);
