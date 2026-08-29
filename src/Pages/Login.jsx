import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { loginUser, registerUser, sendResetLink } from "../firebase/auth";

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
        const result = await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        onLogin(result);
      } else {
        const result = await loginUser({
          email: form.email,
          password: form.password,
        });
        onLogin(result);
      }
    } catch (authError) {
      setError(authError.message || getAuthErrorMessage("auth/unknown"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (authError) {
      const friendlyMessage =
        getAuthErrorMessage(authError?.code) ||
        (authError?.message || "Google sign-in failed.");
      setError(friendlyMessage);
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
      await sendResetLink(form.email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch (authError) {
      setError(authError.message || getAuthErrorMessage("auth/unknown"));
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
    "auth/user-not-found": "No account was found with this email.",
    "auth/popup-blocked": "Google sign-in was blocked by the browser. Please allow popups and try again.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/unauthorized-domain": "This domain is not authorized in Firebase. Add localhost as an authorized domain.",
    "auth/operation-not-allowed": "Google sign-in is not enabled in Firebase Authentication.",
    "auth/account-exists-with-different-credential": "An account already exists with a different sign-in method.",
    "auth/too-many-requests": "Too many sign-in attempts. Please wait a moment and try again.",
    "auth/network-request-failed": "Network connection failed. Check your internet and try again."
  };

  return messages[code] || "Authentication failed. Please try again.";
}

export default Login;