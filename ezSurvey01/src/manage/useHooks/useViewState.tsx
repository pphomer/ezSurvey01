import React, { useContext } from 'react';
import { useEffect, useReducer } from 'react'

const ACTION_TYPE = {
  RESET: "RESET",
  UPDATE: "UPDATE",
}

const createAction = (type, state) => {
  return {
    type,
    payload: state
  }
}

const reset = (state) => createAction(ACTION_TYPE.RESET, state);
const update = (state) => createAction(ACTION_TYPE.UPDATE, state);


const viewStateReducer = (prevState, action) => {

  const { type, payload } = action;

  if (isType(ACTION_TYPE.RESET)) {
    return payload;
  }
  else if (isType(ACTION_TYPE.UPDATE)) {
    return { ...prevState, ...payload }
  }

  return prevState;

  function isType(actionType) {
    return actionType === type;
  }
};

const initValues = {
  showProps: true,
  showQuests: true,
  activeQuesId : -1
}

export const useViewState = () => {
  const [state, dispatch] = useReducer(viewStateReducer, initValues);
  const updateState = (values) => { dispatch(update(values)) }
  const {activeQuesId } = state;
  
  const setActiveQuesId = (id) => updateState({ activeQuesId: id });
  const onActive = (quesid = null) => quesid === null
    ? activeQuesId > -1 : activeQuesId === quesid;
  const offActive = () => setActiveQuesId(-1);
 
  return { onActive, offActive, activeQuesId, setActiveQuesId };
}

const ViewStateContext = React.createContext({});

export const useViewStateContext = () => useContext(ViewStateContext) as any;

export const ViewStateProvider = ({ value, children }) => {
  return (
    <ViewStateContext.Provider value={value} >
      {children}
    </ViewStateContext.Provider>
  )
}