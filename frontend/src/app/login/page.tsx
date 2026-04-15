"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // redirect by role
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }

    } catch (err: any) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">

      <div className="bg-gray-800 p-6 rounded w-96 text-white shadow-lg">

        <h1 className="text-2xl mb-5 font-bold text-center text-green-400">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3  rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full p-2 rounded transition hover:cursor-pointer ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="text-red-400 mt-3 text-sm text-center">
            {error}
          </p>
        )}

      </div>
    </div>
  );
}