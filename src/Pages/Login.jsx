import { useState } from "react";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isRegister && !form.name) {
      alert("Please enter your name.");
      return;
    }

    // Demo only — no real auth backend yet
    onLogin({ name: form.name || "Aayush" });
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <div className="logo-icon">S</div>
          <h2>Scheme Sathi</h2>
          <span>Empowering Entrepreneurs</span>
        </div>

        <h1>
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>

        <p className="auth-subtext">
          {isRegister
            ? "Register to discover schemes suited to you."
            : "Log in to continue to your dashboard."}
        </p>

        <form onSubmit={handleSubmit}>

          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {!isRegister && (
            <div className="auth-forgot">
              <a href="#">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="primary-button full">
            {isRegister ? "Create Account" : "Log In"}
          </button>

        </form>

        <p className="auth-switch">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsRegister(false)}>Log in</span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span onClick={() => setIsRegister(true)}>Sign up</span>
            </>
          )}
        </p>

      </div>

    </div>
  );
}

export default Login;