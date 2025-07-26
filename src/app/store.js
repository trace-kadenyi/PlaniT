import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "../redux/eventsSlice";
import tasksReducer from "../redux/tasksSlice";
import expensesReducer from "../redux/expensesSlice";

const store = configureStore({
  reducer: {
    events: eventsReducer,
    tasks: tasksReducer,
    expenses: expensesReducer,
  },
});

export default store;
