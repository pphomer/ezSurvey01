import React, { FC, memo, useContext, useEffect, useState } from 'react'
import { QuestTypeSelect } from './QuestTypeSelect';
import { FormGroupRow } from './FormGroupRow';
import { QuestContext } from '../question/Question';
import useQuestTypes from '../useHooks/useQuestTypes';
import TinyFunc from '../../components/tinyFunc';
import { RadioGroup } from '../../components/RadioGroup';


export const useQuestContext = () => useContext(QuestContext) as any;

const TinyContent = ({ name, value, labelText, onChange, placeholder, required = false }) => {
  return (
    <FormGroupRow htmlFor={name} labelText={labelText} className="" required={required} >
      <TinyFunc key={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </FormGroupRow>
  )
}

export const QuestContent = () => {
  const name = "questContent";
  const label = "題目";
  const { quest, handleChange } = useQuestContext();

  return <TinyFunc key={name}
    name={name}
    value={quest[name]}
    onChange={handleChange}
    placeholder={label}
  />

  //return <TinyContent key={name}
  //  name={name}
  //  labelText={label}
  //  value={quest[name]}
  //  required={true}
  //  onChange={handleChange}
  //  placeholder={label}
  ///>;
}

export const QuesType = () => {
  const name = "questType";
  const label = "題目類型";
  const questTypes = useQuestTypes();
  const { quest, handleChange } = useQuestContext();

  return (
    /*<FormGroupRow labelText={label}>*/
      <QuestTypeSelect name={name}
        options={questTypes}
        value={quest[name]}
        onChange={handleChange}
      />     
    /*</FormGroupRow>*/
  )
}

const QuestRadios = ({ Pid, name, value, label, options, onChange, remark="" }) => {
  return (
    <FormGroupRow labelText={label} className="quest-radio-group">
      <RadioGroup
        dataName={name}
        name={`${name}_${Pid}`}
        value={value}
        options={options}
        onChange={onChange}
      /> {remark && <span className="align-self-center">{remark}</span>}
    </FormGroupRow>
  )
}

