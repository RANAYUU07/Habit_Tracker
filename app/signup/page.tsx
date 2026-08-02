/*
  ok so what are we gonna do here 

  1. first we willl have a form with fields :- 
    - Email
    - Password

  2. then when we will submit the page the auth signup will be hit or called, os signup endpoint 

  3. after that succeeds the signup will immediately give me a token which we will save in local host (note: - not in cookies, that is for a later project) 

  4. once that succeeds we will route it to the dashboard page 
*/

"use client";

import { useRouter } from "next/navigation";
import { useState, SyntheticEvent } from "react";
import axios from "axios";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter(); // to use the dashboard we need this

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        password,
      }); // this is why axios are better just write the method and url and then body nothing else

      localStorage.setItem("token", res.data.token);
      // here we are saving the token in local storage. Now this is not that safe if someone injects js in it they can get the token of someone from the localStorage

      router.push("/dashboard"); // this will move us to dashboard when this function is called
    } catch (error) {
      console.error("Signup Failed: ", error);
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
      <button type="submit">Signup</button>
    </form>
  );
}
