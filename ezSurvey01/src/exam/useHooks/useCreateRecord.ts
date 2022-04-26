import React from 'react'
import { useAppDispatch } from '../../Util/app/hooks';
import { recordUpdated } from '../examSlice';

export default function useCreateRecord() {
  const dispatch = useAppDispatch();

  const createRecord = (quest) => {
    const { questPId, questId } = quest;
    return { questPId, questId, fillList: [] }
  }

  const createAnswer = (ansId, ansText = '', satisId = '') => ({ ansId, ansText, satisId })
  const createSatisAnswer = (satisId, ansId = '') => ({ satisId, ansId })

  const initRecord = async (quest) => {
    const record = createRecord(quest);

    console.log("initRecord", record);

    await dispatch(recordUpdated(record))
    return record;
  }

  return [createRecord, initRecord, createAnswer, createSatisAnswer] as const;
}
