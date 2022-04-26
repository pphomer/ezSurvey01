import React, { useEffect } from "react";
import { useAppSelector } from "../Util/app/hooks";
import CheckGroup from "./components/CheckGroup";
import RadioGroup from "./components/RadioGroup";
import { selectRecordsByQuestPId } from "./examSlice";
import { Satisfaction } from "./components/Satisfaction";
import MultiLineText from "./components/LineText";
import useCreateRecord from "./useHooks/useCreateRecord";
import { isquestype } from "../manage/components/elements";
import { RecordContext } from "./useHooks/useRecordContext";

const QuestContent = ({ questContent }) => {
  return <div className={"fs-3 mb-4 border-bottom border-info"} dangerouslySetInnerHTML={{ __html: questContent }}></div>
}

const questDetail = (ques) => {

  let QuestDetail;

  if (isquestype(ques, "1")) {
    QuestDetail = RadioGroup;
  } else if (isquestype(ques, "2")) {
    QuestDetail = CheckGroup;
  } else if (isquestype(ques, "4")) {
    QuestDetail = MultiLineText;
  } else if (isquestype(ques, "5")) {
    QuestDetail = Satisfaction;
  } 

  return QuestDetail
}


export const QuestView = ({ quest }) => {
  const QuestDetail = questDetail(quest);
  let record = useAppSelector(state => selectRecordsByQuestPId(state, quest.questPId));
  const [, initRecord] = useCreateRecord();

  useEffect(() => {    
    !record && initRecord(quest);    
  }, [])
  
  if (!record) return <></>

  const { questContent, questId } = quest;

  return (
    <RecordContext.Provider value={({ quest, QuestDetail, record })}>
      <section className="question d-flex bg-light">
        <div className="fw-bolder fs-3">{questId}.</div>
        <div className="ms-2 w-100">
          <QuestContent questContent={questContent} />
          <QuestDetail />
        </div>
      </section>
    </RecordContext.Provider>
  )

  /*return <>{record && <QuestViewContent {...{ quest, QuestDetail, record }} /> }</> */
}