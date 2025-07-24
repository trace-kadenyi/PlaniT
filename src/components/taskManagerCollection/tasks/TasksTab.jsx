import { useState, useEffect, useRef } from "react";
import { Plus, XCircle } from "lucide-react";

import EditTaskForm from "./forms/EditTasksForm";
import CreateTaskForm from "./forms/CreateTaskForm";
import TaskCard from "./TaskCard";

export default function TasksTab({ tasks, handleTaskDelete }) {
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [scrollToForm, setScrollToForm] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    if (scrollToForm && showCreateTaskForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollToForm(false); // reset the trigger
    }
  }, [scrollToForm, showCreateTaskForm]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#9B2C62]">Tasks</h2>
        <button
          onClick={() => {
            if (showCreateTaskForm) {
              setTaskToEdit(null);
            }
            setShowCreateTaskForm(!showCreateTaskForm);
          }}
          className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-full bg-[#BE3455]/10 text-[#BE3455] hover:bg-[#BE3455]/20 transition text-xs cursor-pointer"
        >
          {showCreateTaskForm ? (
            <XCircle className="w-3 h-3" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
          <span>{showCreateTaskForm ? "Cancel" : "Create Task"}</span>
        </button>
      </div>

      {/* Task Form */}
      {showCreateTaskForm && (
        <div ref={formRef} className="mb-6">
          {taskToEdit ? (
            <EditTaskForm
              task={taskToEdit}
              onClose={() => {
                setTaskToEdit(null);
                setShowCreateTaskForm(false);
              }}
            />
          ) : (
            <CreateTaskForm
              onClose={() => {
                setShowCreateTaskForm(false);
              }}
            />
          )}
        </div>
      )}

      {/* Task Loading/Empty States */}
      {tasks.status === "loading" && tasks.items.length === 0 && (
        <p>Loading tasks...</p>
      )}

      {tasks.items.length === 0 && tasks.status === "succeeded" && (
        <p className="text-gray-600">No tasks for this event.</p>
      )}

      {/* Task Cards */}
      <TaskCard
        tasks={tasks.items}
        setTaskToEdit={setTaskToEdit}
        setShowCreateTaskForm={setShowCreateTaskForm}
        handleTaskDelete={handleTaskDelete}
        setScrollToForm={setScrollToForm}
      />
    </>
  );
}
