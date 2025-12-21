import { useState, useEffect, useRef } from "react";
import { Plus, XCircle } from "lucide-react";

import EditTaskForm from "../tasks/forms/EditTaskForm";
import CreateTaskForm from "../tasks/forms/CreateTaskForm";
import TaskCard from "../tasks/TaskCard";
import { CreateTaskBtn } from "../../buttons/TaskButtons";

export default function TasksTab({ tasks, handleTaskDelete }) {
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [scrollToForm, setScrollToForm] = useState(false);

  // formref
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
        <h2 className="text-xl font-bold text-[#9B2C62] dark:text-[#D97706]">
          Tasks ({tasks.items.length})
        </h2>
        <CreateTaskBtn
          showCreateTaskForm={showCreateTaskForm}
          setTaskToEdit={setTaskToEdit}
          setScrollToForm={setScrollToForm}
          setShowCreateTaskForm={setShowCreateTaskForm}
        />
      </div>

      {/* Task Form */}
      {showCreateTaskForm && (
        <div ref={formRef} className="mb-6 scroll-mt-4">
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
        <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
      )}

      {tasks.items.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">
          No tasks for this event.
        </p>
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
