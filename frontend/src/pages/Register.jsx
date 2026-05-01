import React, { useState } from "react";
import { registerUser } from "../api/auth.js";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating account...", {
      description: "Please wait while we set things up",
    });

    try {
      await registerUser(form);

      toast.success("Login successful", {
        description: "Welcome back 👋",
        id: toastId,
      });

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Registration failed", {
        description: error.response?.data?.message || "Something went wrong",
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="bg-background shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Register</h2>
          <div>
            <label className="text-sm font-medium">Username</label>
            <Input
              name="username"
              type="username"
              placeholder="Enter your UserName"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your Email"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              name="password"
              type="password"
              placeholder="password"
              onChange={handleChange}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Register"}
          </Button>
        </form>

        <p>
          Already have an account?{" "}
          <Link
            to="/login"
            className=" text-primary underline hover:font-bold transition-all duration-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
