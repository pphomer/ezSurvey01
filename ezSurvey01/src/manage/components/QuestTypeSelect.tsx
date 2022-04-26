import React from 'react';

export function QuestTypeSelect({ name, options, value, onChange }) {
  const questType = value || "1";

  const qtypeOptions = options.map((qt) => (
    <option key={qt.code} value={qt.code}>
      {qt.text}
    </option>
  ))

  return (
    <>
      <select name={name} value={questType} onChange={onChange}
        className="questType">
        {qtypeOptions}
      </select>
    </>
  )
}