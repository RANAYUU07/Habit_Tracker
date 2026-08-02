// same as the signup page we did, just the endpoint that it hits will be different

"use client";

import { useRouter } from "next/navigation";
import { useState, SyntheticEvent } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login Failed: ", error);
      alert("Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="Email"
          placeholder="Enter your email"
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="Password"
          placeholder="Enter your password"
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
