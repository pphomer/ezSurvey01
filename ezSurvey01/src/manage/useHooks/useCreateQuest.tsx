import React from 'react'
import { useQuestListModify } from '../useHooks/useQuestListModify';
import { useViewStateContext } from './useViewState';
import useGoQuesId from './useGoQuesId';
import useQNRContext from '../../common/useHooks/QNRContext';
import { nanoid } from '@reduxjs/toolkit';

const create = (newquesid, textcontent) => {

  const newcontent = `${textcontent} - ${newquesid + 1}`;

  return {
    questPId: nanoid(),
    questId: newquesid,
    questType: "1",
    questContent: newcontent,
    newState: 1
  }
}

export default function useCreateQuest() {    
  const [, addQuest] = useQuestListModify();
  const { state: { questList }, updateState } = useQNRContext();
   
  const createQuest = (textcontent="", newquesid = 0) => {
    const _newquesid = newquesid || questList.length;
    const _quest = create( _newquesid, textcontent);
    const newquests = addQuest(_quest, questList);
    //dispatch(questListReset(newquests));
    updateState({ questList: newquests })
    const newQuesId = newquests.filter(q => q.questPId === _quest.questPId)[0].questId;
    return newQuesId;
  }

  return [createQuest]
}

export function useAddNewQuest() {

  const { onActive, setActiveQuesId } = useViewStateContext();  
  const [createQuest] = useCreateQuest();  
  const { goQuesId } = useGoQuesId();

  const addNewQuest = (textcontent = "", newquesid = 0) => {
    if (onActive()) return;
    const newQuesId = createQuest(`新增題目 - ${textcontent}`, newquesid);
    setActiveQuesId(newQuesId)
    console.log("CreateQuestIcon");
    setTimeout(() => {
      // 元件還沒長出來就是要等一下...
      goQuesId(newQuesId);
    }, 100)
  }

  return { addNewQuest };
}
