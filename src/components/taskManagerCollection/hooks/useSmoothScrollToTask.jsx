import { useEffect, useRef } from "react";

export function useSmoothScrollToTask(scrollTaskId, scrollNonce, eventId) {
  const hasScrolledToTaskRef = useRef(false);

  // Reset the scroll flag when any of the dependencies change
  useEffect(() => {
    hasScrolledToTaskRef.current = false;
  }, [scrollTaskId, scrollNonce, eventId]);

  useEffect(() => {
    if (!scrollTaskId) return;

    const highlightTask = (taskElement) => {
      taskElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      taskElement.classList.add(
        "!border-2",
        "!border-[#9B2C62]",
        "dark:!border-[#F59E0B]",
        "!bg-[#FFF9F5]/50",
        "dark:!bg-gray-900/50",
        "!shadow-lg"
      );

      setTimeout(() => {
        taskElement.classList.remove(
          "!border-2",
          "!border-[#9B2C62]",
          "dark:!border-[#F59E0B]",
          "!bg-[#FFF9F5]/50",
          "dark:!bg-gray-900/50",
          "!shadow-lg"
        );
      }, 3000);
    };

    const tryScroll = () => {
      const el = document.getElementById(scrollTaskId);
      if (el && !hasScrolledToTaskRef.current) {
        hasScrolledToTaskRef.current = true;
        setTimeout(() => highlightTask(el), 300);
        return true;
      }
      return false;
    };

    if (tryScroll()) return;

    const observer = new MutationObserver(() => {
      if (tryScroll()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [scrollTaskId, scrollNonce, eventId]);
}
