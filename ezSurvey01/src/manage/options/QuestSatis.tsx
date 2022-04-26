import React, { useContext } from 'react';
import { TrueFalse_Checkbox } from '../components/elements';
import { QuestContext, useQuestContext } from '../question/Question';
import { useForm } from '../useHooks/useForm';
import { DeleteItem } from './deleteItem';


export const useQuestContent = () => {
  const content_name = "content"
  const _htmlFor = (quest) => `${content_name}_${quest.questPId}`
  return { content_name, _htmlFor };
}

const QuestContent = () => {

  const { content_name } = useQuestContent();
  const { satis, handleChange } = useSatisContext();

  return (
    <>
      <input type="text"
        name={content_name}
        value={satis[content_name]}
        onChange={handleChange}
        className="form-control satis-quest"
        placeholder="請輸入滿意度題目"
        required
      />
    </>
  )
}


const SatisContext = React.createContext({});
export const useSatisContext = () => useContext(SatisContext) as any;

export const QuestSatis = ({ item }) => {
  const { state: satis, handleChange, updateState } = useForm(item);
  const { quest: { satisQuests }, updateQuest } = useQuestContext();
  const { id, order } = satis;

  const handleBlur = () => {
    const newlist = satisQuests.map(st => (
      st.id === id? satis : st
    ))
    updateQuest({ satisQuests: newlist });
  }

  const handleDelete = () => {
    const newlist = satisQuests.filter(st => (
      st.id !== id
    )).map((st, index) => (
      { ...st, questId: index + 1 }
    ))
    updateQuest({ satisQuests: newlist });
  }

  return (
    <SatisContext.Provider value={{ satis, handleChange, updateSatis: updateState }}>
      <div className="questitem satis" onBlur={handleBlur} >
        <div className="questitem-index"><strong>{order}</strong></div>
        <div className="questitem-content"><QuestContent /></div>
        <DeleteItem onDelete={handleDelete} />
      </div>
    </SatisContext.Provider>
  )
}
