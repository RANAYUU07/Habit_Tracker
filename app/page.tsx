import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1> Welcome to Habit Tracker </h1>
      <p> Track your habits, one day at a time </p>
      <Link href="/login">Login</Link>
      <Link href="/signup">Signup</Link>
    </div>
  );
}
