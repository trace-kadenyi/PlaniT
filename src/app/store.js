import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "../redux/eventsSlice";
import tasksReducer from "../redux/tasksSlice";

const store = configureStore({
  reducer: {
    events: eventsReducer,
    tasks: tasksReducer,
  },
});

export default store;
