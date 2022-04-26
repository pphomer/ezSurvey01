import React, { useContext, useState } from 'react'

export function useActiveQuesId() {

  const [activeQuesId, setActiveQuesId] = useState(-1);

  const onActive = (quesid = null) => quesid === null
                             ? activeQuesId > -1 : activeQuesId === quesid;
  const offActive = () => setActiveQuesId(-1);

  return { onActive, offActive, activeQuesId, setActiveQuesId }
}

export const ActiveQuesIdContext = React.createContext({});

export function useActiveQuest() { return useContext(ActiveQuesIdContext) as any};

export const ActiveQuestProvider = (props) => {
  return (
    <ActiveQuesIdContext.Provider value={props.value}>
      {props.children}
    </ActiveQuesIdContext.Provider>
  )
}

