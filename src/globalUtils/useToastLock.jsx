import { useRef } from "react";

export const useToastLock = () => {
  const lockRef = useRef(null);

  const lock = (value = true) => {
    lockRef.current = value;
  };

  const unlock = () => {
    lockRef.current = null;
  };

  const isLocked = () => Boolean(lockRef.current);

  return {
    lockRef,
    lock,
    unlock,
    isLocked,
  };
};
