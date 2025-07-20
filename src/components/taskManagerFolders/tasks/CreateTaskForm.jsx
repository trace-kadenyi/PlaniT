import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  resetTaskStatus,
  updateTask,
} from "../../../redux/tasksSlice";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateTaskForm({ onClose, task }) {
  const dispatch = useDispatch();
  const { id: eventId } = useParams();
  const taskStatus = useSelector((state) => state.tasks.status);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "Medium",
    status: "To Do",
  });

  useEffect(() => {
    if (task) {
      setForm(task);
    }
  }, [task]);

  useEffect(() => {
    if (taskStatus === "succeeded") {
      setForm({
        title: "",
        description: "",
        assignedTo: "",
        deadline: "",
        priority: "Medium",
        status: "To Do",
      });
      dispatch(resetTaskStatus());
    }
  }, [taskStatus, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { ...form };

    try {
      if (task) {
        await dispatch(
          updateTask({ taskId: task._id, updatedData: taskData })
        ).unwrap();
        toast.success("Task updated successfully");
      } else {
        await dispatch(addTask({ eventId, taskData })).unwrap();
        toast.success("Task created successfully");
      }

      if (onClose) onClose();
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#FFF8F2] p-6 rounded-lg shadow-md space-y-4 border border-[#F3EDE9]"
    >
      <h2 className="text-xl font-bold text-[#9B2C62]">
        {task ? "Edit Task" : "Create Task"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          value={form.title}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Assigned To
        </label>
        <input
          type="text"
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Deadline
        </label>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>In Review</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={taskStatus === "loading"}
          className="px-4 py-2 rounded-md bg-[#9B2C62] text-white hover:bg-[#801f4f] transition"
        >
          {taskStatus === "loading"
            ? "Saving..."
            : task
            ? "Update Task"
            : "Create Task"}
        </button>
      </div>
    </form>
  );
}
