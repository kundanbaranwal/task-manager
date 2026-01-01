import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.isAdmin) {
      navigate("/");
    } else {
      fetchUsers(user.token);
    }
  }, [navigate]);

  const fetchUsers = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get("/api/auth/users", config);
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`/api/auth/users/${id}`, config);
        setUsers(users.filter((u) => u._id !== id));
        toast.success("User deleted");
        if (selectedUserTasks.length > 0) {
          setSelectedUserTasks([]);
          setSelectedUserName("");
        }
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const viewUserTasks = async (userId, userName) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(`/api/tasks/user/${userId}`, config);
      setSelectedUserTasks(response.data);
      setSelectedUserName(userName);
    } catch (error) {
      toast.error("Failed to fetch user tasks");
    }
  };

  return (
    <>
      <section className="heading">
        <h1>Admin Dashboard</h1>
        <p>Manage Users and Tasks</p>
      </section>

      <div className="content">
        <h2>Users</h2>
        <div className="users-list">
          {users.map((user) => (
            <div
              key={user._id}
              className="user-item"
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{user.name}</strong> ({user.email}){" "}
                {user.isAdmin && <span style={{ color: "red" }}>(Admin)</span>}
              </div>
              <div>
                <button
                  className="btn"
                  style={{ marginRight: "10px" }}
                  onClick={() => viewUserTasks(user._id, user.name)}
                >
                  View Tasks
                </button>
                <button
                  className="btn btn-reverse"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedUserName && (
          <div className="user-tasks" style={{ marginTop: "40px" }}>
            <h2>Tasks for {selectedUserName}</h2>
            {selectedUserTasks.length > 0 ? (
              <div className="tasks">
                {selectedUserTasks.map((task) => (
                  <div className="task" key={task._id}>
                    <div>{task.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                      Status: {task.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tasks found for this user.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;
