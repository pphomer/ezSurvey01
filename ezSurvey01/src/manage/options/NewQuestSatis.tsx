import { nanoid } from '@reduxjs/toolkit';
import React, { useCallback, useContext, useEffect } from 'react';
import { getNextId } from '../../common/commonUtils';
import { QuestContext } from '../question/Question';


export function NewQuestSatis() {
  const content = "新增滿意度題目";
  const { quest, updateQuest } = useContext(QuestContext) as any;
  const { questPId, satisQuests } = quest;

  const addQuestSatis = useCallback(() => {
    
    const stid = getNextId(satisQuests, "order");
    // const stid = ques_satisfactions === null ? 1 : Math.max(...ques_satisfactions.map(x => x.questId)) + 1

    const satis = {
      id: nanoid(),
      order: stid,
      content: `${content}${stid}`,      
    }
    const newlist = [...satisQuests || [], satis];
    updateQuest({ satisQuests: newlist })

  }, [questPId, satisQuests])


  return (
    <div className="pseudoOuterDrag float-right">
      <label htmlFor="ques_content_btn" className="hidden mr-3 h5">{`請${content}`}</label>
      <button onClick={addQuestSatis} className="btn btn-primary">{content}</button>
    </div>
  )
}