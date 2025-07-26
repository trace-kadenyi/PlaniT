import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { updateTask, resetTaskStatus } from "../../../../redux/tasksSlice";
import { toastWithProgress } from "../../../../globalHooks/useToastWithProgress";
import TaskFormFields from "./TaskFormFields";

export default function EditTaskForm({ task, onClose }) {
  const dispatch = useDispatch();
  const { id: eventId } = useParams();
  const taskStatus = useSelector((state) => state.tasks.status);
  const taskError = useSelector((state) => state.tasks.error);
  const event = useSelector((state) => state.events.selectedEvent);

  // initialize form
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "Medium",
    status: "To Do",
  });

  // Reset status when task changes (when opening a different task)
  useEffect(() => {
    dispatch(resetTaskStatus());

    return () => {
      // Cleanup when component unmounts
      dispatch(resetTaskStatus());
    };
  }, [task?._id, dispatch]); // Reset when task ID changes

  // populate form
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        assignedTo: task.assignedTo || "",
        deadline: task.deadline ? task.deadline.split("T")[0] : "",
        priority: task.priority || "Medium",
        status: task.status || "To Do",
      });
    }
  }, [task]);

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // handle submit
  const handleSubmit = async (e) => {
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
    try {
      const result = await dispatch(
        updateTask({
          taskId: task._id,
          updatedData: form,
        })
      );

      if (updateTask.fulfilled.match(result)) {
        toastWithProgress("Task updated successfully");
        if (onClose) onClose();
      }
    } catch (err) {
      toastWithProgress("Failed to update task");
      console.error("Update error:", err);
    }
  };

  // handle close
  const handleClose = () => {
    dispatch(resetTaskStatus()); // Reset the error state
    if (onClose) onClose(); // Call the original onClose
  };

  return (
    <TaskFormFields
      form={form}
      onFieldChange={handleChange}
      onSubmit={handleSubmit}
      onClose={handleClose}
      taskStatus={taskStatus}
      taskError={taskError}
      eventDate={event?.date}
      mode="edit"
    />
  );
}
