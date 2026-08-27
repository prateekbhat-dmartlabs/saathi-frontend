import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    employeeId: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (
      !credentials.employeeId.trim() ||
      !credentials.password.trim() ||
      !credentials.role
    ) {
      setError(
        "Please enter Employee ID, Password and select a Role."
      );

      return;
    }

    /*
      TEMPORARY LOGIN

      Later this section will call the JWT login API
      provided by your team.
    */

    navigate("/tutorials", {
      state: {
        employeeId: credentials.employeeId,
        role: credentials.role,
      },
    });
  };

  return (
    <main className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>Sign In</h1>

          <p>
            Access tutorials based on your role
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="form-group">
            <label htmlFor="employeeId">
              Employee ID
            </label>

            <input
              id="employeeId"
              name="employeeId"
              type="text"
              placeholder="Enter Employee ID"
              value={credentials.employeeId}
              onChange={handleChange}
            />
          </div>


          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>


          <div className="form-group">
            <label htmlFor="role">
              Role
            </label>

            <select
              id="role"
              name="role"
              value={credentials.role}
              onChange={handleChange}
            >
              <option value="">
                Select your role
              </option>

              <option value="GRN Officer">
                GRN Officer
              </option>

              <option value="Store Manager">
                Store Manager
              </option>
<option value="admin">
                Admin
              </option>
<option value="developer">
                Developer
              </option>

              <option value="Inventory Manager">
                Inventory Manager
              </option>
            </select>
          </div>


          {error && (
            <p className="login-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            className="login-button"
          >
            Sign In
          </button>

        </form>

      </div>
    </main>
  );
}

export default LoginPage;