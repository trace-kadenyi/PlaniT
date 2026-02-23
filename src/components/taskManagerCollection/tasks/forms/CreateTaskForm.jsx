import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { addTask, resetTaskStatus } from "../../../../redux/tasksSlice";
import { fetchUsers } from "../../../../redux/usersSlice";

import { toastWithProgress } from "../../../../globalHooks/useToastWithProgress";
import TaskFormFields from "./TaskFormFields";

export default function CreateTaskForm({ onClose }) {
  const dispatch = useDispatch();
  const { id: eventId } = useParams();
  const taskStatus = useSelector((state) => state.tasks.createStatus);
  const taskError = useSelector((state) => state.tasks.createError);
  const event = useSelector((state) => state.events.selectedEvent);
  const allUsers = useSelector((state) => state.users.items);
  const organizationStatus = useSelector((state) => state.users.status);

  const organizationUsers = useMemo(
    () => allUsers.filter((user) => !user.isDeactivated),
    [allUsers],
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "Medium",
    status: "To Do",
  });

  // Fetch organization users when component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

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

    const submitData = {
      ...form,
      assignedTo: form.assignedTo || null,
    };

    dispatch(addTask({ eventId, taskData: submitData }))
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
      organizationUsers={organizationUsers}
      organizationStatus={organizationStatus}
      mode="create"
    />
  );
}
