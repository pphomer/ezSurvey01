import React from 'react';

const Radio = ({ name, value, label, checked, onChange, dataName }) => {
  const id = `${name}${value}`
  return (
    <div className="form-check form-check-inline">
      <input type="radio"
        id={id} value={value}
        name={name}
        checked={checked}
        onChange={onChange}
        data-name={dataName}
        className="form-check-input"
      />
      <label htmlFor={id} className="form-check-label">{label}</label>
    </div>
  )
}



export function RadioGroup({ dataName, name, value, options, onChange }) {

  const radioList = options.map(op => {
    return <Radio
      key={op.value}
      dataName={dataName}
      name={name}
      value={op.value}
      checked={value === op.value}
      onChange={onChange}
      label={op.text}
    />
  })

  return <div className="d-inline-block"> {radioList} </div>
}

export function RadioGroup1({ dataName, name, value, options, onChange }) {

  return (
    <div style={{ display: 'inline' }}>
      {
        options.map(op => (
          <label key={op.value}>
            <input type="radio"
              data-name={dataName}
              name={name}
              value={op.value}
              checked={value === op.value}
              onChange={onChange}
            /> {op.text}
          </label>
        ))
      }
    </div>
  )
}