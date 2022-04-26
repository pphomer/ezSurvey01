export default function useWarning(name, errors) {
  const errmsg = errors && errors[name];
  // const errors = useAppSelector(selectErrors);

  return {
    warning: errmsg && "warning" || "",
    message: errmsg
  };
}

