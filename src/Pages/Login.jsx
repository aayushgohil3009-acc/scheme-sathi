import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider, signInWithPopup } from "../firebase";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isRegister && !form.name) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const result = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        await updateProfile(result.user, { displayName: form.name });
        onLogin(result.user);
      } else {
        const result = await signInWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        onLogin(result.user);
      }
    } catch (authError) {
      setError(getAuthErrorMessage(authError.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (authError) {
      if (authError.code !== "auth/popup-closed-by-user") {
        setError(getAuthErrorMessage(authError.code));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.email) {
      setError("Enter your email address first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, form.email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch (authError) {
      setError(getAuthErrorMessage(authError.code));
    }
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
              <a href="#forgot-password" onClick={handlePasswordReset}>
                Forgot password?
              </a>
            </div>
          )}

          {error && <p className="auth-message error">{error}</p>}
          {message && <p className="auth-message success">{message}</p>}

          <button type="submit" className="primary-button full" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Log In"}
          </button>

        </form>

        {!isRegister && (
          <>
            <div className="auth-divider"><span>or</span></div>
            <button
              type="button"
              className="google-button"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <span className="google-icon">G</span>
              Continue with Google
            </button>
          </>
        )}

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

function getAuthErrorMessage(code) {
  const messages = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account was found with this email."
  };

  return messages[code] || "Authentication failed. Please try again.";
}

export default Login;