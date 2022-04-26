import React, { useCallback } from 'react'

export const useQuestListModify = () => {

  const reorder = useCallback((quests) => {
    const newquests = quests.map((quest, index) => (
      { ...quest, questId: index + 1 }
    ))
    return newquests;
  }, []);

  const add = useCallback((newquest, questlist) => {
    const { questId } = newquest ;
    let _questlist = [...questlist]
    _questlist.splice(questId, 0, newquest);

    return reorder(_questlist);
  },[])

  const del = useCallback((quest, questlist) => {
    const { questId, index = questId - 1  } = quest;
    let _questlist = [...questlist]
    _questlist.splice(index, 1 );

    return reorder(_questlist);
  },[])

  return [reorder, add, del] as const
}
