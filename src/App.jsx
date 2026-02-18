import { useEffect, useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState(() => {
    const data = localStorage.getItem("todos");
    return data ? JSON.parse(data) : [];
  });
  const [filter, setFilter] = useState("all");

  function addTodo() {
    if (!task.trim()) return;
    const obj = { text: task, completed: false, id: Date.now() };
    setTodos([...todos, obj]);
    setTask("");
  }

  function deleteTodo(index) {
    setTodos(todos.filter((_, i) => i !== index));
  }

  function toggleComplete(index) {
    setTodos(
      todos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const filterTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-mono flex items-start justify-center pt-16 px-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase mb-2">
            productivity tool
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-lime-400 leading-none">
            TASKS
            <span className="text-white">.</span>
          </h1>
          {totalCount > 0 && (
            <p className="mt-3 text-sm text-neutral-500">
              <span className="font-bold text-neutral-300">{completedCount}</span>
              <span> / {totalCount} completed</span>
            </p>
          )}
        </div>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="mb-8 h-0.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-400 transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={task}
            placeholder="What needs to be done?"
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="flex-1 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 px-4 py-3 text-sm outline-none focus:border-lime-400 transition-colors duration-200 rounded"
          />
          <button
            onClick={addTodo}
            className="bg-lime-400 text-black font-bold text-sm px-5 py-3 hover:bg-lime-300 active:scale-95 transition-all duration-150 rounded"
          >
            ADD
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 bg-neutral-900 p-1 rounded">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 rounded ${
                filter === f
                  ? "bg-lime-400 text-black"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <ul className="space-y-2">
          {filterTodos.length === 0 && (
            <li className="text-center py-16 text-neutral-700 text-sm tracking-widest uppercase">
              {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
            </li>
          )}
          {filterTodos.map((todo, index) => (
            <li
              key={todo.id || index}
              className="group flex items-center gap-3 bg-neutral-900 border border-neutral-800 px-4 py-3 hover:border-neutral-700 transition-all duration-200 rounded"
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleComplete(todos.indexOf(todo))}
                className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-all duration-200 ${
                  todo.completed
                    ? "bg-lime-400 border-lime-400"
                    : "border-neutral-600 hover:border-lime-400"
                }`}
              >
                {todo.completed && (
                  <svg
                    className="w-3 h-3 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              {/* Text */}
              <span
                onClick={() => toggleComplete(todos.indexOf(todo))}
                className={`flex-1 text-sm cursor-pointer select-none transition-all duration-200 ${
                  todo.completed
                    ? "line-through text-neutral-600"
                    : "text-neutral-200"
                }`}
              >
                {todo.text}
              </span>

              {/* Delete */}
              <button
                onClick={() => deleteTodo(todos.indexOf(todo))}
                className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 transition-all duration-200 text-lg leading-none"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-xs text-neutral-700">
            <span>{todos.filter((t) => !t.completed).length} remaining</span>
            <button
              onClick={() => setTodos(todos.filter((t) => !t.completed))}
              className="hover:text-neutral-400 transition-colors duration-200 uppercase tracking-widest"
            >
              Clear done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;