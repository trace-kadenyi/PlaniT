import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "../redux/eventsSlice";
import tasksReducer from "../redux/tasksSlice";
import expensesReducer from "../redux/expensesSlice";
import clientsReducer from "../redux/clientsSlice";

const store = configureStore({
  reducer: {
    events: eventsReducer,
    tasks: tasksReducer,
    expenses: expensesReducer,
    clients: clientsReducer,
  },
});

export default store;
