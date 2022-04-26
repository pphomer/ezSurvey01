import React, { CSSProperties, useCallback, useContext  } from 'react'
import { QuestView } from './QuestView';
import { QuestEdit } from './QuestEdit';
import { ButtonTools } from '../components/ButtonTools';
import "./quest.css"
import { useViewStateContext } from '../useHooks/useViewState';
import { useForm } from '../useHooks/useForm';
import useQNRContext from '../../common/useHooks/QNRContext';


export const QuestContext = React.createContext({});
export const useQuestContext = () => useContext(QuestContext) as any;


export const Question = ({ questPId }) => {
  const { state: { questList } } = useQNRContext();
  const _quest = questList.filter(q => q.questPId === questPId)[0];
  const { state: quest, handleChange, updateState: updateQuest } = useForm(_quest);

  console.log("Question", _quest, quest);

  const { onActive } = useViewStateContext();
  const { questId } = quest;
  const active = onActive(questId);

  if (!quest) return <div> waiting!!!!! </div>

  return (
    <QuestContext.Provider value={{ quest, handleChange, updateQuest }}>
      <div className="question" data-quesid={questId} data-quespid={questPId} >
        <div className={`quest-toolbar ${active && 'sticky' || ''}`}>
          <h2 className="adj-quest-h2">第{questId}題</h2>
          {(!onActive() || active) && <ButtonTools />}
        </div>
        {active ? <QuestEdit /> : <QuestView />}
      </div>
    </QuestContext.Provider>
  )
}
