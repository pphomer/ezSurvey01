import React from 'react'

export const CheckBoxInline = ({ name, value, label, checked, onChange }) => {
  const id = `${name}${value}`
  return (
    <div className="form-check form-check-inline">
      <input type="checkbox"
        id={id} value={value}
        name={name}
        checked={checked}
        onChange={onChange}
        className="form-check-input"
      />
      <label htmlFor={id} className="form-check-label">{label}</label>
    </div>
  )
}

export const CustomCheckBoxInline = ({ name, value, label, checked, onChange }) => {
  const id = `${name}${value}`
  return (
    <div className="custom-control-inline custom-checkbox checkbox-lg">
      <input type="checkbox"
        id={id} value={value}
        name={name}
        checked={checked}
        onChange={onChange}
        className="custom-control-input"
      />
      <label htmlFor={id} className="custom-control-label">{label}</label>
    </div>
  )
}

export const CheckBoxGroupInline = ({ name, items, checkedValues, update }) => {
  //const [checkedValues, setCheckedValues] = useState([]);

  const handleChange = event => {
    let _checkedValues = [];
    if (event.target.checked) {
      _checkedValues = [...checkedValues, event.target.value];
    } else {
      _checkedValues = checkedValues.filter(v => v !== event.target.value);
    }
    // setCheckedValues(_checkedValues);
    update({ [name]: _checkedValues })
  }

  const checkBoxList = items.map(it => {
    const { value, label } = it;
    const checked = checkedValues.includes(value);
    
    return <CheckBoxInline key={value}
      name={name} value={value} label={label}
      checked={checked} onChange={handleChange } />
  });

  return (
    <div> {checkBoxList} </div>
  )
}
