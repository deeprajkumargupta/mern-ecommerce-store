import React from "react";
import { useState, useEffect } from "react";
import { loginUser } from "../api/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/profile");
  //   }
  // }, []);

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

      navigate("/profile");
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
      <form
        onSubmit={handleSubmit}
        className="bg-background shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6"
      >
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
      </form>
    </div>
  );
};

export default Login;
