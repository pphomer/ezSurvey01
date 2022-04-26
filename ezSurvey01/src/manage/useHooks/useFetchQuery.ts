import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '../../Util/app/hooks';

const saveParams = (key, params) =>
  sessionStorage.setItem(key, JSON.stringify(params));

const getParams = (key) => {
  let params = sessionStorage.getItem(key);
  return params && JSON.parse(params);
}

const initState = {
  keyword: "",
  examstatus: [],
  betemplate: "",
  PageID: 1,
  PageSize: 10
}

export function useFetchQuery(fetchList, qkey = "") {
  const dispatch = useAppDispatch();
  const queryparams = `queryparams_${qkey}`;
  const [params, setParams] = useState(() => getParams(queryparams) || initState);
  const fetchRef = useRef(false);

  useEffect(() => {    
    saveParams(queryparams, params);
    if (fetchRef.current) {
      console.log("params", params);
      const betemplate = params.betemplate === "1";
      dispatch(fetchList({ ...params, betemplate}));
    }
    fetchRef.current = false;
  }, [params])

  const fetch = (addparams = {}) => {
    fetchRef.current = true;
    updateParams(addparams);
  };

  const updateParams = (addparams) => {
    setParams(prevparams => ({ ...prevparams, ...addparams }));    
  }

  const reset = (addparams = {}) => {
    fetchRef.current = true;
    updateParams({ ...initState, ...addparams });
  };

  return [fetch, params, updateParams, reset];
}
