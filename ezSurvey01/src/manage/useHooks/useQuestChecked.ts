import React, { useContext, useEffect, useRef, useState } from 'react'
import { inView, removeTags } from '../../common/commonUtils';
import { isquestype } from '../components/elements';
import { useOptionContent } from '../options/QuestOption';
import { useQuestContent } from '../options/QuestSatis';
import { QuestContext } from '../question/Question';

const hidden = "hidden";
const warning = "warning";
const labelWarning = "label.warning";
const trimSpace = (str) => str?.replace(/\&nbsp;| |　/g, '');
const trimTagSpace = (str) => trimSpace(removeTags(str)); // 題目不可以僅貼圖

const dataChecked = (quest) => {
  const { _htmlFor: optHtmlFor } = useOptionContent();
  const { _htmlFor: staHtmlFor } = useQuestContent();
  const { questContent, options, satisQuests } = quest;

  $(`label[for='ques_content']`).toggleClass(warning, !trimTagSpace(questContent))

  if (isquestype(quest, "1", "2", "5")) {
    const hasOptions = options?.length > 0;
    $(`label[for='option_content_btn']`).toggleClass(warning, !hasOptions);
    if (hasOptions) {
      options.map(op => {
        const htmlfor = optHtmlFor(op);
        $(`label[for='${htmlfor}']`).toggleClass(warning, !op.content)
      })
    }
  }

  if (isquestype(quest, "5")) {
    const hasSatis = satisQuests?.length > 0;
    console.log("ques_content_btn hasSatis", hasSatis);
    $(`label[for='ques_content_btn']`).toggleClass(warning, !hasSatis);
    if (hasSatis) {
      satisQuests.map(st => {
        const htmlfor = staHtmlFor(st);
        $(`label[for='${htmlfor}']`).toggleClass(warning, !st.content)
      })
    }
  }

  return $(labelWarning).length === 0;
}

export function useQuestChecked() {
  const showWarningRef = useRef(false);
  const [checked, setChecked] = useState(false);
  const { quest } = useContext(QuestContext) as any;

  useEffect(() => {
    setChecked(dataChecked(quest))
    $(labelWarning).toggleClass(warning, showWarningRef.current);
  }, [quest])

  const scrollToWarning = async () => {
    const $labelWarning = $(labelWarning)[0];
    const _inView = await inView($labelWarning);
    if (!_inView) {
      $labelWarning.scrollIntoView({ block: "center" })
    }
  }

  const setShowWarning = (show) => {
    showWarningRef.current = show;
  }

  const questChecked = (quest) => {
    showWarningRef.current = true;
    const _checked = dataChecked(quest);
    if (!_checked) {
      scrollToWarning();
    }
    return _checked;
  }

  // warning 的邏輯選擇
  // 1. 一直檢核&出現warning
  // 2. "儲存"才檢核&出現warning
  // 3. 一直檢核, "儲存"才會出現warning...要消失或保持warning??
  // 4. "儲存+之後"一直出現warning, *****
  return [checked, questChecked, setShowWarning] as const;
}