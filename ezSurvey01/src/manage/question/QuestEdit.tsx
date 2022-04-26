import React, { useContext, useMemo } from 'react'
//import { AfterPageBreak, AnsForFill, IsRequired, OptOrientation, PreComment, QuesContent, QuesType } from '../components/questedit_elements'
import { isquestype } from '../components/elements';
import { QuestOptionList, QuestSatisList } from '../options/QuestItemList';
import { NewQuestSatis } from '../options/NewQuestSatis';
import { NewQuestOption } from '../options/NewQuestOption';
import { QuestContext } from './Question';
import {  QuestContent } from '../components/questedit_elements';


const MultiChoice = () => (
  <>
    <QuestOptionList />
    <NewQuestOption />
  </>
)

const Satisfaction = () => (
  <>
    <div className="row">
      <div className="col-7">
        <div className="pseudoOuterDrag font-weight-bold">縱向欄位(滿意度題目) *</div>
        <QuestSatisList />
        <NewQuestSatis />
      </div>
      <div className="col-5">
        <div className="pseudoOuterDrag font-weight-bold">橫向欄位(滿意度選項) *</div>
        <QuestOptionList />
        <NewQuestOption />
      </div>
    </div>
  </>
)

export const QuestEdit = () => {
  const { quest } = useContext(QuestContext) as any;

  const QuestBody = useMemo(() => {
    return isquestype(quest, "1", "2") ? MultiChoice
      : isquestype(quest, "5") ? Satisfaction
        : null;
  }, [quest.questType])

  return (
    <div className="questedit">
      <div className="questcontent"><QuestContent /></div>
      <div className="questbody"><QuestBody /></div>
    </div>
  )
}
