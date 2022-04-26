import React, { useEffect } from 'react'
import { fetchUser, selectStatus, selectUser } from '../commonSlice'
import { useAppDispatch, useAppSelector } from '../../Util/app/hooks'

export const useUser = () => {
  const dispatch = useAppDispatch()
  const commonStatus = useAppSelector(selectStatus)
  const user = useAppSelector(selectUser)
  useEffect(() => {
    if (commonStatus === 'idle') {
      dispatch(fetchUser())
    }
  }, [])

  console.log("useUser", commonStatus, user);

  return user;
}