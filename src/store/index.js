import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "../features/events/eventsSlice";
import tasksReducer from "../features/tasks/tasksSlice";

const store = configureStore({
  reducer: {
    events: eventsReducer,
    tasks: tasksReducer,
  },
});

export default store;
