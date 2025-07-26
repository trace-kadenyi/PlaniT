import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { addTask, resetTaskStatus } from "../../../../redux/tasksSlice";
import { toastWithProgress } from "../../../../globalHooks/useToastWithProgress";
import TaskFormFields from "./TaskFormFields";

export default function CreateTaskForm({ onClose }) {
  const dispatch = useDispatch();
  const { id: eventId } = useParams();
  const taskStatus = useSelector((state) => state.tasks.status);
  const taskError = useSelector((state) => state.tasks.error);
  const event = useSelector((state) => state.events.selectedEvent);

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
    // Client-side deadline validation
    if (event && form.deadline) {
      const taskDeadline = new Date(form.deadline);
      const eventDate = new Date(event.date);

      if (taskDeadline > eventDate) {
        toastWithProgress("Task deadline cannot be after the event date");
        return;
      }
    }
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
      eventDate={event?.date}
      mode="create"
    />
  );
}
