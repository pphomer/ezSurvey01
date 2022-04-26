import React, { useCallback, useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useAppDispatch, useAppSelector } from '../Util/app/hooks';
import update from 'immutability-helper'
import useQNRContext from '../common/useHooks/QNRContext';
import { useViewStateContext } from './useHooks/useViewState';
import { useQuestListModify } from './useHooks/useQuestListModify';
import { updateQuestList } from './manageSlice';
import { DragSource } from './components/DragSource';
import { Question } from './question/Question';
import { ItemTypes } from './components/ItemTypes';

export const QNRQuests = () => {

  const dispatch = useAppDispatch();
  const { state: { questList } } = useQNRContext();
  const [reorderQuestList] = useQuestListModify();
  const [quests, setQuests] = useState([]);
  const { onActive, _onActive = onActive() } = useViewStateContext();

  console.log("QNRQuests questList", questList);

  useEffect(() => {
    setQuests(questList||[]);
  }, [questList])

  const moveQuest = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = quests[dragIndex];
      console.log("moveQuest", dragIndex, hoverIndex, dragCard);

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
      dispatch(updateQuestList(newquests));
      console.log("updateOrders ", newquests, quests, questList);
    },
    [quests],
  )

  const render = (quest, index) => {
    const { questPId } = quest;
    return (
      <DragSource
        key={questPId}
        id={questPId}
        index={index}
        moveCard={moveQuest}
        updateOrder={updateOrders}
        itemType={ItemTypes.CARD}
        onActive={_onActive}
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
