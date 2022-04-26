import React, { useCallback, useState } from "react";
import { useAppDispatch } from "../../Util/app/hooks";
import { recordUpdated } from "../examSlice";
import useCreateRecord from "../useHooks/useCreateRecord";
import { useRecordContext } from "../useHooks/useRecordContext";
import "./Satisfaction.css"

const Thead = ({ options }) => {
  return (
    <thead className="table-light">
      <tr><th>題目\選項</th>{
        options.map(item => (
          <th key={item.id}>{item.content}</th>
        ))
      }
      </tr>
    </thead>
    )
}

const OptionCheck = ({ satisId, opId }) => {
  const dispatch = useAppDispatch();
  const { record } = useRecordContext();
  const [,,, createSatisAnswer] = useCreateRecord();

  const { ansId } = record.fillList.filter(a => a.satisId === satisId)[0] || {};

  const handleChange = (event) => {
    let fillList = record.fillList.filter(a => a.satisId !== satisId)
    
    if (event.target.checked) {
      fillList = [...fillList, createSatisAnswer(satisId, opId)]
    }

    const newRecord = { ...record, fillList}
    dispatch(recordUpdated(newRecord))
  }

  const checked = ansId === opId;

  return <input type="checkbox" className="form-check-input" checked={checked} onChange={handleChange} />
}

const optionCheckList = ({ options, satisId }) => {
  return (
    <>
      {options.map((opitem, index) => {
        const { id:opId } = opitem;
        return (
          <td key={index}>
            <OptionCheck satisId={satisId} opId={opId}/>              
          </td>
        )
      })}
    </>
  )
}

const OptionCheckList = React.memo(optionCheckList);

export const Satisfaction = () => {
  const { quest, record } = useRecordContext();
  const { options = [], satisQuests = [] } = quest;

  console.log("Satisfaction", record)
      
  return (
    <div className="table-responsive">
      <table className="table table-hover table-striped">
        <Thead options={options} />
        <tbody>{
          satisQuests.map(qsitem => {
            const { id:satisId, content } = qsitem;
            return (
              <tr key={satisId}>
                <td><span className={`satis`}>{content}</span></td>
                <OptionCheckList satisId={satisId} options={options}/>
              </tr>
            )
          })
        }
        </tbody>
      </table>
    </div>
  )
}
