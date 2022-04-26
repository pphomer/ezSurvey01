import React, { useEffect } from 'react'
import { useAppSelector } from '../../Util/app/hooks';

export default function useFetch({ selectStatus, selectErrors, selectIds, fetchList }) {
  const status = useAppSelector(selectStatus)
  const errors = useAppSelector(selectErrors)
  const Ids = useAppSelector(selectIds);

  useEffect(() => {
    if (status === 'idle') {
      fetchList();
    }
  }, [status])

  let statusMessage;

  if (status === 'loading') {
    statusMessage = <div className="loader" > Loading...</div>
  } else if (status === 'error') {
    statusMessage = <div>{ JSON.stringify(errors) } </div>
  }

  const succeedLoaded = status === 'succeeded';

  return [statusMessage, succeedLoaded, Ids]
}
