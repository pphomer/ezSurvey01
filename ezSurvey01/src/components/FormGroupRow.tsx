import React from 'react'
import { RiErrorWarningFill } from 'react-icons/ri';

export const FormRow = ({
  labelControl = null, labelCol = "col-sm-3", contentCol = "col-sm",
  className = "", required = undefined, children }) => {
  return (
    <div className={`form-group row ${className} ${required ? 'required' : ''}`} >
      <div className={`${labelCol} text-end`}>
        { labelControl }
      </div>
      <div className={`${contentCol}`}>
        {children}
      </div>
    </div>
  )
}

export const Label = ({ name="", warning = "", text = "", warnmessage = "" }) => {
  return (
    <label className={`col-form-label font-weight-bold ${warning}`}>
      {text}
      {warning &&
        <>
        {/*<RiErrorWarningFill className="position-absolute" />*/}
          <span className="position-absolute message">{warnmessage}</span>
        </>}

    </label>
  )
}

export const FormGroupRow = ({ label = "", className = "", children, warning = "", required = undefined }) => {

  const labelControl = <Label warning={warning} text={label} />;

  return (
    <FormRow labelControl={labelControl} className={className} required={required }>
      {children}
    </FormRow>
  )
}
