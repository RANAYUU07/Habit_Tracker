"use client";

import { useRouter } from "next/navigation";
import { useState, SyntheticEvent } from "react";
import axios from "axios";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup Failed: ", error);
      alert("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF8] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-[#E5E2D9] rounded-xl p-8 flex flex-col gap-4"
      >
        <h1 className="text-xl font-semibold text-[#2C2C2A] mb-2">
          Create your account
        </h1>

        <label className="flex flex-col gap-1 text-sm text-[#5F5E5A]">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="Email"
            placeholder="Enter your email"
            className="h-10 px-3 rounded-lg border border-[#E5E2D9] outline-none text-sm text-[#2C2C2A] focus:border-[#D85A30]"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-[#5F5E5A]">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="Password"
            placeholder="Enter your password"
            className="h-10 px-3 rounded-lg border border-[#E5E2D9] outline-none text-sm text-[#2C2C2A] focus:border-[#D85A30]"
          />
        </label>

        <button
          type="submit"
          className="h-10 mt-2 rounded-lg bg-[#D85A30] text-[#FAECE7] text-sm font-medium hover:bg-[#C24E27] transition-colors"
        >
          Sign up
        </button>

        <p className="text-xs text-[#888780] text-center mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-[#D85A30] hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
