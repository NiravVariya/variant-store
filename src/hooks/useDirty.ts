import lodash from "lodash";
import { useEffect, useRef, useState } from "react";

type UseDirty<T> = [boolean, React.MutableRefObject<T>];

const useDirty = <T>(item: T): UseDirty<T> => {
  const previousItem = useRef<T>(item);
  const [isDirty, setDirty] = useState(false);

  useEffect(() => {
    if (!item || !previousItem.current) return;
    if (!lodash.isEqual(previousItem.current, item)) {
      setDirty(true);
    } else {
      setDirty(false);
    }
  }, [item, previousItem]);

  return [isDirty, previousItem];
};

export default useDirty;
