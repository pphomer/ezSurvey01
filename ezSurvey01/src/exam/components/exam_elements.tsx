import React from "react";

export const QNRHeader = ({ title, description }) => {
  return (
    <section className="header bg-light">
      <QNRTitle {...{ title }} />
      {description && <QNRDescription {...{ description }} />}
    </section >
  )
}

const QNRTitle = ({ title }) => {
  return (
    <h1><span>{title}</span></h1>
  )
}

const QNRDescription = ({ description }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: description }}></div>
  )
}
