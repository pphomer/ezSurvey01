import { selectClientSettings, selectManageSettings, } from '../commonSlice'
import { useAppDispatch, useAppSelector } from '../../Util/app/hooks'
import { useEffect, useState } from 'react';

export const useClientSettings = () => {
  const settings = useAppSelector(selectClientSettings)
  return settings || {};
}

export const useManageSettings = () => {
  const settings = useAppSelector(selectManageSettings)
  return settings|| {};
}

export const useAppSettings = (fetchSettings) => {
  const dispatch = useAppDispatch()
  const [loaded, setLoaded] = useState(false);
  //const settings = useManageSettings();
  
  useEffect(() => {
    const _fetchSettings = async () => {
      await dispatch(fetchSettings());
      setLoaded(true);
    }
    
    _fetchSettings();
  }, [])

  return { loaded };
}
