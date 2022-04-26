import { nanoid } from '@reduxjs/toolkit';
import React, { useCallback, useContext, useEffect } from 'react';
import { getNextId } from '../../common/commonUtils';
import { QuestContext } from '../question/Question';

export function NewQuestOption() {
  const content = "新增選項";
  const { quest, updateQuest } = useContext(QuestContext) as any;
  const { questPId, options } = quest;

  const addQuestOption = useCallback(
    () => {      
      const opid = getNextId(options, "order");
      //const opid = ques_options === null ? 1 : Math.max(...ques_options.map(x => x.option_order)) + 1

      const option = {
        id: nanoid(),
        order: opid,
        content: `${content}${opid}`,
        has_fillFld:"n"
      }

      const newlist = [...options || [], option]
      updateQuest({ options: newlist })
    }, [questPId, options])

  return (
    <div className="pseudoOuterDrag float-right">
      <label htmlFor="option_content_btn" className="hidden mr-3 h5">{`請${content}`}</label>
      <button onClick={addQuestOption} className="btn btn-primary">{content}</button>
    </div>
  )
}