"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";

export default function UserPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [msg, setMsg] = useState("");

  // 🔐 AUTH CHECK + FETCH USER FROM BACKEND
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");

      setUser(res.data);
      setName(res.data.name);
    } catch (err) {
      console.log(err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // ✏️ UPDATE NAME
  const updateProfile = async () => {
    try {
      setMsg("");

      const res = await API.put(`/users/${user._id}`, {
        name,
      });

      setUser(res.data);
      setMsg("Profile updated successfully ✅");

    } catch (err: any) {
      setMsg(err.response?.data?.msg || "Error updating profile");
    }
  };

  // 🔐 CHANGE PASSWORD
  const changePassword = async () => {
    try {
      setMsg("");

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/users/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.msg || "Error updating password");
        return;
      }

      setMsg("Password updated successfully 🔐");
      setOldPassword("");
      setNewPassword("");

    } catch (err) {
      setMsg("Server error");
    }
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-blue-400 mb-2">
        User Dashboard 👤
      </h1>

      <p className="text-gray-400 mb-6">
        Manage your profile and security
      </p>

      {/* PROFILE CARD */}
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md border border-gray-800">

        <h2 className="text-xl font-bold text-green-400 mb-4">
          Profile Info
        </h2>

        <input
          className="w-full p-2 mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <p className="text-gray-400 mb-3">{user.email}</p>

        <button
          onClick={updateProfile}
          className="bg-blue-600 w-full py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </div>

      {/* PASSWORD CARD */}
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md mt-6 border border-gray-800">

        <h2 className="text-xl font-bold text-yellow-400 mb-4">
          Change Password 🔐
        </h2>

        <input
          type="password"
          placeholder="Old Password"
          className="w-full p-2 mb-3 rounded"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 mb-3  rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={changePassword}
          className="bg-yellow-600 w-full py-2 rounded hover:bg-yellow-700"
        >
          Update Password
        </button>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex gap-3">

        <button
          onClick={() => router.push("/")}
          className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
        >
          Home
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>

      </div>

      {/* MESSAGE */}
      {msg && (
        <p className="mt-4 text-sm text-gray-300">{msg}</p>
      )}

    </div>
  );
}