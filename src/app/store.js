import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "../features/eventsSlice";
import tasksReducer from "../features/tasksSlice";

const store = configureStore({
  reducer: {
    events: eventsReducer,
    tasks: tasksReducer,
  },
});

export default store;
