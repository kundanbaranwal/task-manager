import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const onLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Intern Assignment</Link>
      </div>
      <ul>
        {user ? (
          <li>
            {user.isAdmin && (
              <Link to="/admin" style={{ marginRight: "20px" }}>
                Admin Dashboard
              </Link>
            )}
            <button className="btn" onClick={onLogout}>
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Navbar;
