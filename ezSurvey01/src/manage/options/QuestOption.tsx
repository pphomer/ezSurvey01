import React, { CSSProperties, useContext } from 'react'
import { DeleteItem } from './deleteItem';
import { isquestype, TrueFalse_Checkbox } from '../components/elements';
import { QuestContext, useQuestContext } from '../question/Question';
import { FormGroupRow } from '../components/FormGroupRow';
import { useForm } from '../useHooks/useForm';

export const useOptionContent = () => {
  const content_name = "content"  
  const _htmlFor = (option) => `${content_name}_${option.id}`
  return { content_name, _htmlFor };
}

const Opt_content = ({ className = "", placeholder="" }) => {
  const { content_name } = useOptionContent();
  const { option: { content }, handleChange } = useContext(OptionContext) as any;
  return (
    <input type="text"
      name={content_name}
      value={content}
      onChange={handleChange}
      className={`form-control ${className}`}
      placeholder={placeholder}
      required
    />
  )
}

const MCQ_Opt_Content = () => {
  return (<>
    <Opt_content className="quest-option" />
    <Opt_hasAppendText />
  </>
  )
}

const STA_Opt_Content = () => {
  return <Opt_content className="satis-option" placeholder="請輸入滿意度選項" />
}


const Opt_hasAppendText = () => {
  const name = "hasAppendText"
  const { option, handleChange } = useContext(OptionContext) as any;
  const { id:opId } = option;
  return (
    <>
      <TrueFalse_Checkbox
        id={`${name}_${opId}`}
        name={name}
        value={option[name]}
        onChange={handleChange}
        label="增加輸入框"
      />
    </>
  )
}

const OptionContext = React.createContext({});


export const QuestOption = ({ item }) => {
  const { state: option, handleChange, updateState } = useForm(item);
  const { quest, updateQuest} = useQuestContext();
  //const { quest: { options, questType }, updateQuest } = useContext(QuestContext) as any;
  const { options } = quest;
  const { id, order } = option;

  const handleBlur = () => {
    //console.log("===== handleBlur ");
   
    const newlist = options.map(op => (
      op.id === id ? option : op
    ))
    updateQuest({ options: newlist });
  }

  const handleDelete = () => {
    const newlist = options.filter(op => (
      op.id !== id
    )).map((op, index) => (
      { ...op, order: index + 1 }
    ))
    updateQuest({ options: newlist });
  }

  const optionROW = isquestype(quest, "1", "2") ? <MCQ_Opt_Content />
    : isquestype(quest, "5") ? <STA_Opt_Content />
      : "";

  return (
    <OptionContext.Provider value={{ option, handleChange, updateState }}>
      <div className="questitem option" onBlur={handleBlur}>
        <div className="questitem-index"><strong>{order}</strong></div>
        <div className={"questitem-content"}>{optionROW}</div>
        <DeleteItem onDelete={handleDelete} />
      </div>
    </OptionContext.Provider>
  )
}
