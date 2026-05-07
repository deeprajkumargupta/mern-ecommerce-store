import React from "react";
import { useState, useEffect } from "react";
import { loginUser } from "../api/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const googleUser = result.user;

      const API_URL =
        import.meta.env.VITE_AUTH_API_URL ||
        "http://localhost:5000/api/v1/auth/google";

      const res = await axios.post(
        `${API_URL}`,
        {
          email: googleUser.email,
          username: googleUser.displayName,
          avatar: googleUser.photoURL,
        },
        {
          withCredentials: true,
        },
      );

      await login();

      toast.success("Google login successful");

      navigate("/");
    } catch (error) {
      console.log(error);

      toast.error("Google login failed");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Logging in...", {
      description: "Please wait while we verify your credentials",
      position: "top-right",
    });

    try {
      await loginUser(form);

      // await login(res.data.data.token);
      await login();
      // navigate("/profile");

      toast.success("Login successful", {
        description: "Welcome back 👋",
        id: toastId,
      });

      navigate("/");
    } catch (error) {
      toast.error("Login failed", {
        description: error.response?.data?.message || "Invalid credentials",
        id: toastId,
      });
      // setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="bg-background shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Login</h2>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your Email"
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>
        </form>
        <p>
          Don’t have an account?{" "}
          <Link
            to="/register"
            className=" text-primary underline hover:font-bold transition-all duration-300"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
