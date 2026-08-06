import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF8] px-4 text-center">
      <h1 className="text-3xl font-semibold text-[#2C2C2A] mb-3">
        Welcome to Habit Tracker
      </h1>
      <p className="text-sm text-[#888780] mb-8">
        Track your habits, one day at a time.
      </p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="h-10 px-6 flex items-center rounded-lg border border-[#E5E2D9] text-sm font-medium text-[#2C2C2A] hover:bg-white transition-colors"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="h-10 px-6 flex items-center rounded-lg bg-[#D85A30] text-sm font-medium text-[#FAECE7] hover:bg-[#C24E27] transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
