import useWarningMessage  from "../../common/useHooks/useWarning";
import { useAppSelector } from "../../Util/app/hooks";
import { selectErrors } from "../manageSlice";

export default function useWarning(name) {
  const errors = useAppSelector(selectErrors);
  const warningMessage = useWarningMessage(name, errors);
  
  return warningMessage
}

