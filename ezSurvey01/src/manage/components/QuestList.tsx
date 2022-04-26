import { useCallback, useEffect, useState } from "react";
import { useViewStateContext } from "../useHooks/useViewState";
import update from 'immutability-helper'
import { useQuestListModify } from "../useHooks/useQuestListModify";
import React from "react";
import { DragSource } from "./DragSource";
import { ItemTypes } from "./ItemTypes";
import { Question } from "../question/Question";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


export const QuestList = ({ questList }) => {
    
  const [reorderQuestList] = useQuestListModify();
  const [quests, setQuests] = useState([]);
  const { onActive } = useViewStateContext();
  const dragDisabled = onActive();
  useEffect(() => {
    setQuests(questList);
  }, [questList])

  const moveQuest = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = quests[dragIndex];
      //console.log("moveQuest", dragIndex, hoverIndex, dragCard);

      setQuests(
        update(quests, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      )
    },
    [quests],
  )

  const updateOrders = useCallback(
    () => {
      const newquests = reorderQuestList(quests);
      //dispatch(questListReset(newquests));
      //dispatch(updateQuestOrders(newquests));
      console.log("updateOrders ", quests, questList);
    },
    [quests],
  )

  const render = (quest, index: number) => {
    const { questPId } = quest;
    return (
      <DragSource
        key={questPId}
        id={questPId}
        index={index}
        moveCard={moveQuest}
        updateOrder={updateOrders}
        itemType={ItemTypes.CARD}
        disabled={dragDisabled}
      >
        <Question questPId={questPId} />
      </DragSource>
    )
  }


  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {quests.map((quest, index) => render(quest, index))}
      </DndProvider>
    </>
  );
}