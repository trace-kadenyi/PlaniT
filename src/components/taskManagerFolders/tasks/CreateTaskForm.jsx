import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { addTask, resetTaskStatus } from "../../../redux/tasksSlice";
import { toastWithProgress } from "../utils/toastWithProgress";
import TaskFormFields from "./TaskFormFields";

export default function CreateTaskForm({ onClose }) {
  const dispatch = useDispatch();
  const { id: eventId } = useParams();
  const taskStatus = useSelector((state) => state.tasks.status);
  const taskError = useSelector((state) => state.tasks.error);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "Medium",
    status: "To Do",
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTask({ eventId, taskData: form }))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setForm({
            title: "",
            description: "",
            assignedTo: "",
            deadline: "",
            priority: "Medium",
            status: "To Do",
          });
          toastWithProgress("Task created successfully");
          if (onClose) onClose();
        }
      })
      .catch((err) => {
        // Error will be automatically handled by the slice
        toastWithProgress(`Error: ${err.message}`);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Reset status when unmounting
  useEffect(() => {
    return () => {
      dispatch(resetTaskStatus());
    };
  }, [dispatch]);

  return (
    <TaskFormFields
      form={form}
      onFieldChange={handleChange}
      onSubmit={handleSubmit}
      onClose={onClose}
      taskStatus={taskStatus}
      taskError={taskError}
      mode="create"
    />
  );
}
