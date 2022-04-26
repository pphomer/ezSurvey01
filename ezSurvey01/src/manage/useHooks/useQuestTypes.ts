import { useAppSelector } from '../../Util/app/hooks';
import { selectQuestTypeList } from '../manageSlice';

export default function useQuestTypes() {

  return useAppSelector(selectQuestTypeList);

}
