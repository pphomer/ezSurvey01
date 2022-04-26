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
  

const formReducer = (prevState, action) => {

  const { type, payload } = action;
  
  if (isType(ACTION_TYPE.RESET)) {
    return payload;
  }
  else if (isType(ACTION_TYPE.UPDATE)) {

    console.log("payload", payload);

    return { ...prevState, ...payload }
  }

  return prevState;

  function isType(actionType) {
    return actionType === type;
  }
};

const booleanComponents = ["checkbox"];

export const useForm = (initValues) => {
  const [state, dispatch] = useReducer(formReducer, initValues);

  useEffect(() => {
    console.log("useForm resetState", initValues)
    resetState(initValues);
  }, [initValues])

  console.log("useForm state", state)

  const handleChange = event => {
    const { type, name, checked, value, dataset } = event.target;
    const _name = dataset?.name || name;
    const _value = booleanComponents.includes(type)
      ? checked ? (dataset.true || value) : (dataset.false || '')
      : value;

    updateState({ [_name]: _value })
  }

  const resetState = (values) => { dispatch(reset(values))}
  const updateState = (values) => { dispatch(update(values))}
  

  return { state, handleChange, updateState };

}