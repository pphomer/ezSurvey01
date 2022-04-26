import React from "react";
import { RecordContext } from "../useHooks/useRecordContext";

const QuestContent = ({ questContent }) => {  
  return <div className={""} dangerouslySetInnerHTML={{ __html: questContent }}></div>
}

export const QuestViewContent = (props) => {
  const { quest, QuestDetail } = props;
  const { questContent, questId } = quest;
  
  return (
    <RecordContext.Provider value={props}>
      <section className="question">
        <div>{questId}.</div>
        <div>
          <QuestContent questContent={questContent} />
          <QuestDetail />
        </div>
      </section>
    </RecordContext.Provider>
  )
}