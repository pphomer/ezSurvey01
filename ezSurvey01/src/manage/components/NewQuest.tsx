import React from 'react';
import useCreateQuest from '../useHooks/useCreateQuest';
import useGoQuesId from '../useHooks/useGoQuesId';
import { useViewStateContext } from '../useHooks/useViewState';

const ObserverNewQuest = (quesid) => {
   // https://thewebdev.info/2021/04/11/how-to-make-a-javascript-function-wait-until-an-element-exists-before-running-it/
  // create an observer instance
  var observer = new MutationObserver(function (mutations, obs) {
    const quest = $(`.question[data-quesid='${quesid}']`)[0];
    if (quest) {
      console.log(quest)
      obs.disconnect();
      return;
    }
  });

  // configuration of the observer:
  var config = { attributes: true, childList: true, characterData: true };

  // pass in the target node, as well as the observer options
  observer.observe(document, config);

  // later, you can stop observing
  //observer.disconnect();

}

export function NewQuest() {

  const [newQuest] = useCreateQuest();  
  const { onActive, setActiveQuesId } = useViewStateContext();
  
  const { goQuesId } = useGoQuesId();
  const handleClick = () => {
    // const newQuesId = getNextId(quests, "questId");
    const newQuesId = newQuest("附加題目");
    setActiveQuesId(newQuesId)
    
    setTimeout(() => {
      // 元件還沒長出來就是要等一下...
      goQuesId(newQuesId);
    }, 100) 
  }

  return (
    <>
      <button onClick={handleClick} className={"btn btn-primary btn-block"} disabled={onActive()}>
        附加題目
      </button>
    </>
  )
}