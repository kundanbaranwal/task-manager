import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchTasks(storedUser.token);
    }
  }, [navigate]);

  const fetchTasks = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get("/api/tasks", config);
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post("/api/tasks", { title: text }, config);
      setTasks([...tasks, response.data]);
      setText("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`/api/tasks/${id}`, config);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
        <p>Tasks Dashboard</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="text">Task</label>
            <input
              type="text"
              name="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-block" type="submit">
              Add Task
            </button>
          </div>
        </form>
      </section>

      <section className="content">
        {tasks.length > 0 ? (
          <div className="tasks">
            {tasks.map((task) => (
              <div className="task" key={task._id}>
                <div>{task.title}</div>
                <button onClick={() => deleteTask(task._id)} className="close">
                  X
                </button>
              </div>
            ))}
          </div>
        ) : (
          <h3>You have not set any tasks</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;
