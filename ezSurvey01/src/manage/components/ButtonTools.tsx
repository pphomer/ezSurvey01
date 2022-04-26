import React, { useContext } from 'react'
import { useAppDispatch, useAppSelector } from '../../Util/app/hooks';
import { useViewStateContext } from '../useHooks/useViewState';
import { useQuestChecked } from '../useHooks/useQuestChecked';
import { useQuestListModify } from '../useHooks/useQuestListModify';
import useGoQuesId from '../useHooks/useGoQuesId';
import { selectQuestList, updateQNRObj } from '../manageSlice';
import useQNRContext from '../../common/useHooks/QNRContext';
import { nanoid } from '@reduxjs/toolkit';
import { QuesType, useQuestContext } from './questedit_elements';

const btnOutline = (disabled) => disabled ? "btn-outline-secondary" : "btn-outline-primary";

const ToolButton = ({ disabled, onClick, text, dclass="" }) => {
  return (
    <button type="button" className={`btn ${dclass} ${btnOutline(disabled)} btn-sm`}
      disabled={disabled} onClick={onClick}>
      {text}
    </button>
  )
}

export const ButtonTools = () => {
  const dispatch = useAppDispatch();
  const _questList = useAppSelector(selectQuestList);
  const { quest, updateQuest } = useQuestContext();
  const { questPId, questId } = quest;
  const { state } = useQNRContext();
  const { questList } = state;
  const { goQuesId } = useGoQuesId();
  
  const { onActive, offActive, setActiveQuesId } = useViewStateContext();
  const active = onActive(questId);
  const [checked, questChecked, setShowWarning] = useQuestChecked();
  const [, addQuest, removeQuest] = useQuestListModify();
  
  const doEdit = () => setActiveQuesId(questId);
  
  const doSave = async () => {
    if (questChecked(quest)) {
      const _quest = { ...quest, newState: false };
      const newquests = questList.map(q => q.questPId === questPId ? _quest : q);
      //const { newState = false } = _quest;
      //newState ? await dispatch(addNewQuest(quest))
      //         : await dispatch(updateQuest(quest));
      dispatch(updateQNRObj({ ...state, questList: newquests }));
      offActive();
      goQuesId(questId)
    }
  }
  const doCancel = () => {
    offActive();

    const _quest = questList.find(q => q.questPId === questPId);
    if (_quest.newState) {
      const newquests = removeQuest(_quest, questList);
      dispatch(updateQNRObj({ ...state, questList: newquests }));
    } else {
      updateQuest(_quest);
    }
    
    goQuesId(questId)
    setShowWarning(false);
  };
  const doCopy = () => {
    const newquest = { ...quest, questPId: nanoid()}
    const newquests = addQuest(newquest, questList);
    console.log("doCopy", newquests);
    dispatch(updateQNRObj({ ...state, questList: newquests }));
  }
  const doDelete = () => {
    const newquests = removeQuest(quest, questList);
    dispatch(updateQNRObj({ ...state, questList: newquests }));
  }

  const dclass = disabled => disabled ? "d-none" : "";

  return (
    <div className={`btn-toolbar ${active ? "active" : ""}`} role="toolbar" aria-label="Toolbar with button groups">
      {active ? <QuesType /> : ""}
      <div className="btn-group mr-2" role="group" aria-label="First group">
        <ToolButton disabled={active} onClick={doEdit} text="編輯" />
        <ToolButton disabled={!active} dclass={dclass(!active)} onClick={doSave} text="確認" />
        <ToolButton disabled={!active} dclass={dclass(!active)} onClick={doCancel} text="取消" />     
        <ToolButton disabled={active} dclass={dclass(active)} onClick={doCopy} text="複製" />
        <ToolButton disabled={active} dclass={dclass(active)} onClick={doDelete} text="刪除" />
      </div>
    </div>
  )
}


