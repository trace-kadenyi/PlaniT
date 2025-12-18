// Simplified version without console logs
import { useEffect, useId } from "react";

export function useSmoothScrollToTask(scrollTaskId) {
  const instanceId = useId();

  useEffect(() => {
    if (!scrollTaskId) return;

    let hasScrolled = false;

    const highlightTask = (taskElement) => {
      if (hasScrolled) return;
      hasScrolled = true;

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
      if (el && !hasScrolled) {
        setTimeout(() => highlightTask(el), 100);
        return true;
      }
      return false;
    };

    if (tryScroll()) return;

    const observer = new MutationObserver(() => {
      if (tryScroll()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const timeout = setTimeout(() => observer.disconnect(), 5000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [scrollTaskId, instanceId]);
}
