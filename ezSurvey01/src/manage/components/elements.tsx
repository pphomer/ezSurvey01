import React from 'react'

export function isquestype(quest, ...args: any[]) { return args.includes(quest.questType) };

export const TrueFalse_Checkbox = ({ id, name, value, label, onChange, className ="mr-5" }) => {
  const dataTrue = "y"
  const dataFalse = "n"
  return (
    <div className={`form-check ms-2`}>
    <input type="checkbox"
      name={name}
      id={id}
      data-true={dataTrue}
      data-false={dataFalse}
      checked={value === dataTrue}
      onChange={onChange}
      className="form-check-input"
      />
      <label htmlFor={id} className="form-check-label font-weight-bold">{label}</label>
      </div>
  )
}

export const NumInput = ({ name, value, onChange, className ="" }) => {
  return (
    <input type="tel"
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`num-input ${className}`}
    />
  )
}
  




