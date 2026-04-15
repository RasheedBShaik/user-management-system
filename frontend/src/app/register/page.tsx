"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      // optional auto-login after register
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // redirect by role
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }

    } catch (err: any) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">

      <div className="bg-gray-900 p-8 rounded-xl w-96 shadow-lg border border-gray-800">

        <h1 className="text-3xl font-bold text-green-400 mb-6 text-center">
          Create Account
        </h1>

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ROLE SELECT */}
        <select
          className="w-full p-2 mb-4 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {/* BUTTON */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full p-2 rounded transition cursor-pointer ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mt-3 text-center">
            {error}
          </p>
        )}

        {/* LOGIN LINK */}
        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}