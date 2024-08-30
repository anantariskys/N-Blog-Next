"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email format");
      return;
    }
  
    try {
      const response = await axios.post("/api/auth/register", {
        username,
        email,
        name,
        password,
      });
  
      if (response.status === 201) {
        setTimeout(() => {
          setSuccess("Register Berhasil, Silahkan Login !!!");
        }, 2000);
        router.push("/auth/login");
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data) {
        setError(err.response.data.error || "An error occurred");
      } else {
        setError("An error occurred");
      }
    }
  };
  

  return (
    <div className="h-screen bg-gradient-to-br from-primary to-ternary flex flex-col justify-center items-center">
      <main className="container max-w-sm w-full bg-opacity-40 bg-gray-100 shadow-md p-5 rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-2">N-Gram</h1>
        {success && (
          <p className="text-white rounded w-full  p-2 bg-green-500 flex justify-between items-center gap-1">
            {success}
            <Icon
              icon={"basil:cancel-solid"}
              className="text-3xl"
              onClick={() => setSuccess(null)}
            />
          </p>
        )}
        {error && (
          <p className="text-white rounded w-full  p-2 bg-red-500 flex justify-between items-center gap-1">
            {error}
            <Icon
              icon={"basil:cancel-solid"}
              className="text-3xl"
              onClick={() => setError(null)}
            />
          </p>
        )}
        <h3 className="text-2xl font-semibold">Register</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 text-sm block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 text-sm block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 text-sm block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 text-sm block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white rounded-md shadow-sm hover:scale-95 duration-300 ease-in-out"
          >
            Register
          </button>
          <small>
            sudah punya akun?{" "}
            <Link href={"/auth/login"} className="text-secondary">
              Login
            </Link>
          </small>
        </form>
      </main>
    </div>
  );
};

export default Register;
