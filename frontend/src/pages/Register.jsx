import React, { useState } from "react";
import { googleLoginUser, registerUser } from "../api/auth.js";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const googleUser = result.user;

      await googleLoginUser({
        email: googleUser.email,
        username: googleUser.displayName,
        avatar: googleUser.photoURL,
      });

      await login();

      toast.success("Google signup successful");

      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Google signup failed");
    }
  };

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

      toast.success("Registration successful", {
        description: "You can now log in",
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
