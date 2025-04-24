function Tasks() {
    const handleLogout = () => {
      localStorage.removeItem("token");
      window.location.href = "/";
    };
  
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Task Management</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
  
        {/* ตัวอย่าง Task list */}
        <ul className="list-disc ml-6">
          <li>Task 1</li>
          <li>Task 2</li>
        </ul>
      </div>
    );
  }
  
  export default Tasks;
  