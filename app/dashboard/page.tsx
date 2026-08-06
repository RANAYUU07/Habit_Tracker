"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

function DashboardPAge() {
  type Habit = {
    _id: string;
    name: string;
    completedDates: string[];
    userId: string;
  };

  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitname, setNewhabitname] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchHabits() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/habits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHabits(res.data.habits);
      } catch (error) {
        console.error("Failed to fetch the habits", error);
      }
    }
    fetchHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddHabit() {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/habits",
        {
          name: newHabitname,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setHabits([...habits, res.data.habit]);
      setNewhabitname("");
      setShowAddInput(false);
    } catch (error) {
      console.error("failed to Add Habit", error);
    }
  }

  async function handleToggleComplete(habitId: string) {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/habits/${habitId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setHabits(
        habits.map((habit) => (habit._id === habitId ? res.data.habit : habit)),
      );
    } catch (error) {
      console.error("Failed to toggle the habit", error);
    }
  }

  async function handleDelethabit(habitId: string) {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/habits/${habitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHabits(habits.filter((habit) => habit._id !== habitId));
    } catch (error) {
      console.error("failed to delete the habit", error);
    }
  }

  function isCompletedToday(habit: Habit) {
    const today = new Date().toISOString().split("T")[0];
    return habit.completedDates.some((date) => date.split("T")[0] === today);
  }

  return (
    <div className="min-h-screen flex bg-[#FDFBF8]">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-[#E5E2D9] flex flex-col p-5 shrink-0">
        <p className="text-base font-semibold text-[#2C2C2A] mb-8">
          HabitStack
        </p>

        <nav className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAECE7] text-[#993C1D] text-sm font-medium">
            Dashboard
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#5F5E5A] text-sm">
            History
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#5F5E5A] text-sm">
            Analytics
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#5F5E5A] text-sm">
            Settings
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 px-8 py-10">
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-[#2C2C2A]">Dashboard</h1>

            {!showAddInput && (
              <button
                onClick={() => setShowAddInput(true)}
                className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#D85A30] text-[#FAECE7] text-sm font-medium hover:bg-[#C24E27] transition-colors"
              >
                + Add Habit
              </button>
            )}
          </div>

          {showAddInput && (
            <div className="flex items-center gap-2 mb-6 bg-white border border-[#E5E2D9] rounded-lg p-3">
              <input
                type="text"
                value={newHabitname}
                onChange={(e) => setNewhabitname(e.target.value)}
                placeholder="Write a new habit"
                className="flex-1 bg-transparent outline-none text-sm text-[#2C2C2A] placeholder:text-[#A8A69E]"
                autoFocus
              />
              <button
                onClick={handleAddHabit}
                className="h-8 px-3 rounded-md bg-[#D85A30] text-[#FAECE7] text-sm font-medium hover:bg-[#C24E27] transition-colors"
              >
                Confirm
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {habits.length === 0 && !showAddInput && (
              <p className="text-sm text-[#888780]">
                No habits yet — add one to get started.
              </p>
            )}

            {habits.map((habit) => {
              const done = isCompletedToday(habit);
              return (
                <div
                  key={habit._id}
                  className="flex items-center gap-3 bg-white border border-[#E5E2D9] rounded-lg px-4 py-3 shadow-[-3px_3px_0_#F0997B33]"
                >
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => handleToggleComplete(habit._id)}
                    className="w-5 h-5 accent-[#D85A30] cursor-pointer"
                  />
                  <p
                    className={`flex-1 text-sm font-medium ${
                      done ? "text-[#A8A69E] line-through" : "text-[#2C2C2A]"
                    }`}
                  >
                    {habit.name}
                  </p>
                  <button
                    onClick={() => handleDelethabit(habit._id)}
                    className="text-xs text-[#993C1D] hover:underline"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPAge;
