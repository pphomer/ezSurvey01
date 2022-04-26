import React, { useContext, useEffect, useMemo, useState } from 'react'
import { QuestContext, useQuestContext } from '../question/Question';
import { isquestype } from './elements';
import { FormGroupRow } from './FormGroupRow';
import styles from '../quest.module.css';
import useQuestTypes from '../useHooks/useQuestTypes';



export const QuestContent = () => {

  const { quest: { questContent } } = useQuestContext();
  
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: questContent }}></div>
    </>
  )
}





export const FillContent = () => {
  return <textarea rows={3} className="w-100 form-control noresize" value="" readOnly />     
}

export const Satisfaction = () => {
  const { quest: { options, satisQuests } } = useContext(QuestContext) as any;

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead className="table-light">
          <tr><th>縱向欄位(題目)\橫向欄位(選項)</th>{
            options.map(item => (
              <th key={item.id}>{item.content}</th>
            ))
          }
          </tr>
        </thead>
        <tbody>{
          satisQuests &&
          satisQuests.map(item => {
            return (
              <tr key={item.id}>
                <td>{item.content}</td>
                {options.map((item, index) => (
                  <td key={index}>
                    <input type="checkbox" checked={false} readOnly />
                  </td>)
                )}
              </tr>
            )
          })
        }
        </tbody>
      </table>
    </div>
  )
}
