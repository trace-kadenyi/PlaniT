import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTask, resetTaskStatus } from "../../../redux/tasksSlice";
import toast from "react-hot-toast";

export default function EditTaskForm({ task, onClose }) {
  const dispatch = useDispatch();
  const taskStatus = useSelector((state) => state.tasks.status);
  const taskError = useSelector((state) => state.tasks.error);

  // initialize form
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "Medium",
    status: "To Do",
  });

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
    try {
      const result = await dispatch(
        updateTask({
          taskId: task._id,
          updatedData: form,
        })
      );

      if (updateTask.fulfilled.match(result)) {
        toast.success("Task updated successfully");
        if (onClose) onClose();
      }
    } catch (err) {
      // The error will be automatically handled by Redux
      console.error("Update error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#FFF8F2] p-6 rounded-lg shadow-md space-y-4 border border-[#F3EDE9]"
    >
      <h2 className="text-xl font-bold text-[#9B2C62]">Edit Task</h2>
      {/* title */}
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
      {/* description */}
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
      {/* assigned to */}
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
      {/* deadline */}
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
      {/* priority */}
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
        {/* status */}
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
      {/* Error Message */}
      {taskStatus === "failed" && (
        <div className="p-3 bg-red-50 rounded-md">
          <p className="text-red-600 font-medium">Error creating task:</p>
          <p className="text-red-500 text-sm mt-1">{taskError}</p>
        </div>
      )}
      {/* cancel/submit btns */}
      <div className="flex justify-end gap-3 pt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={taskStatus === "loading"}
          className="px-4 py-2 rounded-md bg-[#9B2C62] text-white hover:bg-[#801f4f] transition"
        >
          {taskStatus === "loading" ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
