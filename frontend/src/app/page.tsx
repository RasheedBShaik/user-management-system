"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  // 🔐 Load session
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      // auto redirect based on role (optional UX upgrade)
      if (parsed.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">

      {/* HERO SECTION */}
      <div className="text-center max-w-2xl">

        <h1 className="text-5xl font-bold text-green-400 mb-4">
          User Management System 👥
        </h1>

        <p className="text-gray-400 text-lg">
          A secure role-based authentication system built with
          <span className="text-blue-400"> MERN Stack</span>
        </p>

      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-10 flex gap-4">

        <button
          onClick={() => router.push("/login")}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition hover:cursor-pointer"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/register")}
          className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded transition border border-gray-700 hover:cursor-pointer"
        >
          Register
        </button>

      </div>

      {/* FEATURES */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-green-400 font-bold mb-2">
            🔐 Secure Auth
          </h3>
          <p className="text-gray-400 text-sm">
            JWT-based authentication with bcrypt password encryption.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-blue-400 font-bold mb-2">
            👑 Role Based Access
          </h3>
          <p className="text-gray-400 text-sm">
            Admin and user roles with protected routes and permissions.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-purple-400 font-bold mb-2">
            ⚡ Full Stack MERN
          </h3>
          <p className="text-gray-400 text-sm">
            MongoDB, Express, React (Next.js), Node.js architecture.
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-20 text-gray-500 text-sm text-center">
        Built with ❤️ using MERN Stack
      </div>

    </div>
  );
}