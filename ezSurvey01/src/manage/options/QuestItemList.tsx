import React, { FC, useState, useEffect, useCallback, useContext } from 'react'
import update from 'immutability-helper'
import { DragSource } from '../components/DragSource';
import { QuestContext } from '../question/Question';
import { QuestOption } from './QuestOption';
import { QuestSatis } from './QuestSatis';
import "./option.css"
import { ItemTypes } from '../components/ItemTypes';
import { useQuestContext } from '../components/questedit_elements';

export interface optItem {
  id: number
  text: string
}

export interface ContainerState {
  cards: optItem[]
}


export const QuestOptionList = () => {
  const { quest: { options }, updateQuest } = useQuestContext();

  const updateOrders = useCallback(options => {
    const newlist = options.map((op, index) => (
      { ...op, order: index + 1 }
    ))
    updateQuest({ options: newlist})
    }, [])

  return <QuestItemList    
    itemList={options}
    ItemComponent={QuestOption}
    updateOrders ={updateOrders}
  />
}

export const QuestSatisList = () => {
  const { quest: { satisQuests }, updateQuest } = useQuestContext();

  const updateOrders = useCallback(satisQuests => {
    const newlist = satisQuests.map((quest, index) => (
      { ...quest, order: index + 1 }
    ))
    updateQuest({ satisQuests: newlist })
  }, [])

  return <QuestItemList
    itemList={satisQuests}
    ItemComponent={QuestSatis}
    updateOrders={updateOrders}
  />
}

export const QuestItemList = ({ itemList, ItemComponent, updateOrders }) => {
  {
    const [items, setItems] = useState([])

    useEffect(() => {
      setItems(itemList);
    }, [itemList]);

    const moveItem = useCallback(
      (dragIndex: number, hoverIndex: number) => {
        const dragOptItem = items[dragIndex]
        console.log("moveOptItem", dragIndex, hoverIndex, dragOptItem);
        setItems(
          update(items, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragOptItem],
            ],
          }),
        )
      }, [items],
    )

    const updateOrder = useCallback(() => {
      console.log("updateOrder", items);
      updateOrders(items)
    }, [items, updateOrders])

    const renderItem = (item, index) => {

      return (
        <DragSource
          key={item.id}
          id={item.id}
          index={index}
          moveCard={moveItem}
          updateOrder={updateOrder}
          itemType={ItemTypes.OPTION}
          option={true}
        >
          <ItemComponent item={item} />
        </DragSource>
      )
    }

    return (
      <>{
        items && items.map((optitem, i) => renderItem(optitem, i))
      }</>
    )
  }
}
