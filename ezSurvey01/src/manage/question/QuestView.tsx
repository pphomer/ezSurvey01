import React, { useContext, useMemo } from 'react'
import { isquestype } from '../components/elements';
import { QuestContext } from './Question';
import { MdAddCircleOutline } from 'react-icons/md';
import { useViewStateContext } from '../useHooks/useViewState';
import { FillContent, QuestContent, Satisfaction } from '../components/questview_elements';
import { useAddNewQuest } from '../useHooks/useCreateQuest';
import RadioGroupReadOnly from '../components/RadioGroupReadOnly';
import CheckGroupReadOnly from '../components/CheckGroupReadOnly';


export const QuestView = () => {
  const { quest } = useContext(QuestContext) as any;
  const { questPId, questId } = quest;
  const { onActive } = useViewStateContext();
  
  const QuestBody
    = isquestype(quest, "1") ? RadioGroupReadOnly
      : isquestype(quest, "2") ? CheckGroupReadOnly
        : isquestype(quest, "5") ? Satisfaction
          : FillContent; // isquestype(quest, "5") 

  return (
    <div className="questview">
      <div className="questcontent"><QuestContent /></div>
      <div className="questbody"><QuestBody /></div>      
      {!onActive() && <CreateQuest questId={questId} />}
    </div>
  )
}

const CreateQuest = ({ questId }) => {
  const { addNewQuest } = useAddNewQuest();
 
  return (
    <div className="icon createQuest" onClick={() => addNewQuest("QuestView", questId)}>
      <MdAddCircleOutline size="2rem" />
    </div>
  )
}