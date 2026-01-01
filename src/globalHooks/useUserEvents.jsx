import { useMemo } from "react";

const useUserEvents = (userTasks) => {
  const userEvents = useMemo(() => {
    if (!userTasks.length) return [];

    const eventsMap = new Map();
    userTasks.forEach((task) => {
      if (task.eventId) {
        const eventId = task.eventId._id || task.eventId;
        if (!eventsMap.has(eventId)) {
          eventsMap.set(eventId, {
            _id: eventId,
            name: task.eventName || "Unnamed Event",
            date: task.eventId?.date,
            taskCount: 1,
            tasks: [task],
          });
        } else {
          const event = eventsMap.get(eventId);
          event.taskCount += 1;
          event.tasks.push(task);
        }
      }
    });

    return Array.from(eventsMap.values());
  }, [userTasks]);

  return userEvents;
};

export default useUserEvents;
