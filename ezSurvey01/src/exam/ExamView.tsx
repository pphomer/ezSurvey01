import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../Util/app/hooks";
import { Pager } from "./components/Pager";
import { BannerTitle } from "./components/BannerTitle";
import { QNRHeader } from "./components/exam_elements";
import { selectQNRObj } from "../manage/manageSlice";
import { QuestView } from "./QuestView";

export const ExamHeader = () => {

  const { qnrid: urlqnrid } = useParams();
  const { qnrid, title, description } = useAppSelector(selectQNRObj)

  useEffect(() => {
    if (qnrid === 0) {
      alert(`問卷（${urlqnrid}）不存在!!`);
      location.href = "/manage"
    }
  }, [qnrid])
  
  const bannerImg_Url ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXhI5ZfFhBY9bR3dJ6-Wsza8ZTRLIGqoLd-g&usqp=CAU"
  return (
    <>
      <BannerTitle imgUrl={bannerImg_Url} />      
      <QNRHeader {...{ title, description }} />
  </>)
}

export const ExamBody = () => {
  const { questList } = useAppSelector(selectQNRObj);
 
  return (<>    
    <div className="questions">
      {questList?.map((quest, index) => <QuestView quest={quest} key={quest.questPId} />)}
    </div>
    <Pager />
  </>)
}
