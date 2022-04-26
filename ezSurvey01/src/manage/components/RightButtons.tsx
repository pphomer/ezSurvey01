import React from 'react'
import { useAppDispatch, useAppSelector } from '../../Util/app/hooks';
import { alertlater, clearUrl } from '../../common/commonUtils';
import { useViewStateContext } from '../useHooks/useViewState';
import { useAddNewQuest } from '../useHooks/useCreateQuest';
import useGoQuesId from '../useHooks/useGoQuesId';
import { selectQNRObj, updateQNR, updateQNRObj } from '../manageSlice';
import { useManageSettings } from '../../common/useHooks/useAppSetting';
import useQNRContext from '../../common/useHooks/QNRContext';
import "./RightButtons.css"
import { nanoid } from '@reduxjs/toolkit';

export default function RightButtons() {

  const dispatch = useAppDispatch();
  const { qnrid } = useAppSelector(selectQNRObj)
  const { onActive, activeQuesId } = useViewStateContext();
  const { goQuesId } = useGoQuesId({ block: "center" });
  const { state } = useQNRContext();
  const { addNewQuest } = useAddNewQuest();
  const { devTools } = useManageSettings();

  const saveData = async (event, params = {}) => {
    event.preventDefault();

    try {
      const _QNRObj = { ...state, ...params };
      const result = await dispatch(updateQNR(_QNRObj)).unwrap();
      dispatch(updateQNRObj(result));
      console.log("result", result);
      if (!state.qnrid) {
        const newpath = clearUrl(`${location.pathname}/${result.qnrid}`);
        history.replaceState(null, "", newpath)
      }
      alertlater("完成存檔!!");
    }
    catch (ex) {
      const validSummary = ex.errors["ValidSummary"];
      const $warning = $(".warning");
      if ($warning && $warning.length > 0) {
        $warning[0].scrollIntoView({ block: "center" })
      };
      alertlater(validSummary);
    }
  }

  const toggleQuesId = (quesId = activeQuesId) => {
    setTimeout(() => {
      goQuesId(quesId, { block: "start" }); // 編輯中一定要 start 才會全展開
    }, 0)
  }

  const handleGoEditItem = () => {
    toggleQuesId();
  }

  const primaryBtn = "btn btn-primary";
  const secondaryBtn = "btn btn-secondary";

  return (
    <div className="RightSticky d-grid gap-1">
      <button className={primaryBtn} onClick={saveData} >儲存</button>
      <button className={primaryBtn} onClick={() => addNewQuest("RightButtons")} disabled={onActive()}>新增題目</button>
      <a className={`${secondaryBtn}`} href={`/exam/${qnrid}`} target="_blank">預覽</a>
      <button className={secondaryBtn} onClick={handleGoEditItem} disabled={!onActive()}> 編輯中{onActive() ? `-${activeQuesId}` : ''}</button>
      {devTools && <button className="btn btn-warning col mb-1" onClick={() => { window.scroll(0, 0) }}>Top</button>}
      {devTools && <a className={`btn btn-warning col mb-1`} href="/manage/">清單頁</a>}

    </div>
  )
}