import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "../redux/eventsSlice";
import tasksReducer from "../redux/tasksSlice";
import expensesReducer from "../redux/expensesSlice";
import clientsReducer from "../redux/clientsSlice";
import vendorsReducer from "../redux/vendorsSlice";
import authReducer from "../redux/authSlice";
import organizationReducer from "../redux/organizationSlice";
import usersReducer from "../redux/usersSlice";
import { setStore } from "./api";

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    tasks: tasksReducer,
    expenses: expensesReducer,
    clients: clientsReducer,
    vendors: vendorsReducer,
    organization: organizationReducer,
    users: usersReducer,
  },
});

setStore(store);

export default store;
