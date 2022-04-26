import React from 'react'
import { RiErrorWarningFill } from 'react-icons/ri';


export const FormRow = ({ labelControl = null, labelCol = "col-sm-2", contentCol = "col-sm", className = "", children }) => {
  return (
    <div className={`row pb-1 ${className}`} >
      <div className={`${labelCol} text-right`}>
        { labelControl }
      </div>
      <div className={`${contentCol} mr-4`}>
        {children}
      </div>
    </div>
  )
}

export const Label = ({ htmlFor = "", text = "", required = false, warnmessage = "" }) => {
  return (
    <label htmlFor={htmlFor} className={`col-form-label font-weight-bold ${required ? "required" : ""}`}>
      {text}
      {warnmessage && <>
          <RiErrorWarningFill className="position-absolute" />
          <span className="position-absolute message">{warnmessage}</span>
        </>}
    </label>
  )
}


export const FormGroupRow = ({ htmlFor="", labelText = "", className = "align-items-center", required = false, children }) => {

  const labelControl = <Label htmlFor={htmlFor} text={labelText} required={required} />;

  return (
    <FormRow labelControl={labelControl} className={className}>
      {children}
    </FormRow>
  )
}
