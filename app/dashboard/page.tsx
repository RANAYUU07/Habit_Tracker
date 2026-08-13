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
  const [newHabitname, setNewhabitname] = useState(""); // for any new habit
  const [showAddInput, setShowAddInput] = useState(false); // the input form will be hidden until add button is clicked

  // the <Habit> thing is not to be worried about everytime. only when there is an empty array as default in useState.

  // now if we write useState([]), the typescript will never know what to put in it, its like making a box with no label, hence it assumes that it will be filled 'never'.
  // and when we do habit._id or habit.name, the typescript panics as it initially thought this was somwthing not to be filled but now we are putting an id in it and name
  // hence we do the 'type Habit' which tells typescript that this is how the info is about to be enterd in the div element, basically we put a label on it now

  const router = useRouter();

  useEffect(() => {
    async function fetchHabits() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/habits`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/habits`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/habits/${habitId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setHabits(
        habits.map((habit) =>
          habit._id === habitId ? res.data.habit : habit,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle the habit", error);
    }
  }

  async function handleDelethabit(habitId: string) {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/habits/${habitId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setHabits(
        habits.filter((habit) => habit._id !== habitId),
      );
    } catch (error) {
      console.error("failed to delete the habit", error);
    }
  }

  function isCompletedToday(habit: Habit) {
    const today = new Date().toISOString().split("T")[0];

    return habit.completedDates.some(
      (d) => d.split("T")[0] === today,
    );
  }

  function isCompletedOnDate(
    habit: Habit,
    date: Date,
  ) {
    const targetDate =
      date.toISOString().split("T")[0];

    return habit.completedDates.some(
      (d) => d.split("T")[0] === targetDate,
    );
  }


  // STREAK FUNCTION


  function getStreak(habit: Habit) {
    const dates = habit.completedDates
      .map((date) => date.split("T")[0])
      .sort();

    // if the habit has no dates no point is tracking its streak
    if (dates.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
      };
    }

    let currentRun = 1;
    let currentStreak = 0;
    let longestStreak = 1;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      const previousDate = new Date(dates[i - 1]);

      const difference =
        currentDate.getTime() -
        previousDate.getTime();

      if (
        difference ===
        1000 * 60 * 60 * 24
      ) {
        // if the difference matches
        currentRun++;
      } else {
        currentRun = 1;
      }
      // if it doesnt start the streak with 1 again

      longestStreak = Math.max(
        currentRun,
        longestStreak,
      );
      // the current streak at start will be the longest streak and from then whichever currentstreak will be greater than the previous greater number the longest streak becomes that

      if (dates[i] === today) {
        currentStreak = currentRun;
      }
    }
    // since we already have calculated the current run we just need to give it or pass it to current streak and on the condition that the habit was done today too.

    if (dates[0] === today) {
      currentStreak = 1;
    }
    // if this is the first day of habit completion

    return {
      currentStreak,
      longestStreak,
    };
    // returning both since this function can find out both
  }


  // WEEKLY COMPLETION


  function getWeeklycompletion(habits: Habit[]) {
    const today = new Date(); // gives out todays date

    const day = today.getDay();
    // gives out todays day but in form of numbers with starting from 0 that will be sunday

    // Sunday = 0
    // Monday = 1
    // Tuesday = 2
    // Wednesday = 3
    // Thursday = 4
    // Friday = 5
    // Saturday = 6

    const daysFromMonday =
      day === 0 ? 6 : day - 1;
    // no. of days of today from monday

    const monday = new Date(today);
    // for now let monday be equal to today's date

    monday.setDate(
      today.getDate() - daysFromMonday,
    );
    // changes the date to actual monday date of that week

    monday.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 999);

    let completion = 0;

    for (const habit of habits) {
      for (const date of habit.completedDates) {
        const completedDate = new Date(date);

        if (
          completedDate >= monday &&
          completedDate <= today
        ) {
          completion++;
        }
      }
    }

    /*
      Number of days that have happened
      in our Monday → Sunday week.

      Monday    → 1
      Tuesday   → 2
      Wednesday → 3
      Thursday  → 4
      Friday    → 5
      Saturday  → 6
      Sunday    → 7
    */

    const numberofDaysSoFar =
      day === 0 ? 7 : day;

    const possibleCompletions =
      habits.length * numberofDaysSoFar;

    if (possibleCompletions === 0) {
      return 0;
    }

    const percentage = Math.round(
      (completion / possibleCompletions) * 100,
    );

    return percentage;
  }


  // CURRENT WEEK


  function getCurrentWeek() {
    const today = new Date();

    const day = today.getDay();

    const daysFromMonday =
      day === 0 ? 6 : day - 1;

    const monday = new Date(today);

    monday.setDate(
      today.getDate() - daysFromMonday,
    );

    monday.setHours(0, 0, 0, 0);

    const week: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);

      date.setDate(monday.getDate() + i);

      week.push(date);
    }

    return week;
  }


  // HEATMAP DATA


  function getHeatmapData() {
    const data: {
      date: string;
      count: number;
    }[] = [];

    const today = new Date();

    // 175 days = 25 weeks × 7 days

    for (let i = 174; i >= 0; i--) {
      const date = new Date(today);

      date.setDate(today.getDate() - i);

      const dateKey = date
        .toISOString()
        .split("T")[0];

      let count = 0;

      for (const habit of habits) {
        if (
          habit.completedDates.some(
            (completedDate) =>
              completedDate.split("T")[0] ===
              dateKey,
          )
        ) {
          count++;
        }
      }

      data.push({
        date: dateKey,
        count,
      });
    }

    return data;
  }

  const weeklyCompletion =
    getWeeklycompletion(habits);

  const currentWeek = getCurrentWeek();

  const heatmapData = getHeatmapData();

  const longestStreak =
    habits.length > 0
      ? Math.max(
          ...habits.map(
            (habit) =>
              getStreak(habit).longestStreak,
          ),
        )
      : 0;

  const currentStreak =
    habits.length > 0
      ? Math.max(
          ...habits.map(
            (habit) =>
              getStreak(habit).currentStreak,
          ),
        )
      : 0;

  const today = new Date();

  const dayName = today.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
    },
  );

  const dateText = today.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="min-h-screen flex bg-[#FDFBF8]">


        {/* SIDEBAR */}

      <aside className="hidden md:flex w-64 bg-white border-r border-[#E5E2D9] flex-col p-6 shrink-0">

        <p className="text-2xl font-semibold text-[#2C2C2A] mb-10">
          HabitStack
        </p>

        <nav className="flex flex-col gap-1 flex-1">

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FAECE7] text-[#993C1D] text-lg font-medium">
            <span>▦</span>
            Dashboard
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5F5E5A] text-lg hover:bg-[#F7F5F0] cursor-pointer">
            <span>◷</span>
            History
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5F5E5A] text-lg hover:bg-[#F7F5F0] cursor-pointer">
            <span>↗</span>
            Analytics
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5F5E5A] text-lg hover:bg-[#F7F5F0] cursor-pointer">
            <span>⚙</span>
            Settings
          </div>

        </nav>

        <div className="pt-6 border-t border-[#E5E2D9]">

          <p className="text-base text-[#A8A69E]">
            HabitStack
          </p>

          <p className="text-base text-[#888780] mt-1">
            Keep showing up.
          </p>

        </div>

      </aside>


          {/* MAIN CONTENT */}

      <div className="flex-1 px-6 sm:px-10 lg:px-12 py-8 lg:py-10 overflow-hidden">

        <div className="w-full max-w-[1400px] mx-auto">

    
              {/* HEADER */}
  

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">

            <div>

              <p className="text-lg text-[#888780] mb-1">
                {dayName}, {dateText}
              </p>

              <h1 className="text-5xl font-semibold text-[#2C2C2A] tracking-tight">
                Welcome back 👋
              </h1>

              <p className="text-lg text-[#888780] mt-2">
                Stay consistent. Small steps add up.
              </p>

            </div>

            {!showAddInput && (
              <button
                onClick={() =>
                  setShowAddInput(true)
                }
                className="self-start sm:self-auto flex items-center gap-2 h-12 px-6 rounded-xl bg-[#D85A30] text-white text-lg font-medium hover:bg-[#C24E27] transition-colors"
              >
                <span className="text-xl">
                  +
                </span>
                New habit
              </button>
            )}

          </div>

    
              {/* ADD HABIT */}
  

          {showAddInput && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 bg-white border border-[#E5E2D9] rounded-2xl p-5">

              <input
                type="text"
                value={newHabitname}
                onChange={(e) =>
                  setNewhabitname(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddHabit();
                  }
                }}
                placeholder="Write a new habit"
                className="flex-1 h-12 bg-[#FDFBF8] border border-[#E5E2D9] rounded-lg px-4 outline-none text-lg text-[#2C2C2A] placeholder:text-[#A8A69E] focus:border-[#D85A30]"
                autoFocus
              />

              <button
                onClick={handleAddHabit}
                className="h-12 px-6 rounded-lg bg-[#D85A30] text-white text-lg font-medium hover:bg-[#C24E27] transition-colors"
              >
                Confirm
              </button>

            </div>
          )}

    
              {/* OVERVIEW */}
  

          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            {/* TOTAL HABITS */}

            <div className="bg-white border border-[#E5E2D9] rounded-2xl p-5 shadow-sm">

              <p className="text-base text-[#888780]">
                Total habits
              </p>

              <p className="text-5xl text-[#2C2C2A] mt-2 font-semibold">
                {habits.length}
              </p>

              <p className="text-base text-[#A8A69E] mt-3">
                Active habits
              </p>

            </div>

            {/* THIS WEEK */}

            <div className="bg-white border border-[#E5E2D9] rounded-2xl p-5 shadow-sm">

              <p className="text-base text-[#888780]">
                This week
              </p>

              <p className="text-5xl text-[#2C2C2A] mt-2 font-semibold">
                {weeklyCompletion}%
              </p>

              <div className="mt-4 h-2 bg-[#F1EEE7] rounded-full overflow-hidden">

                <div
                  className="h-full bg-[#D85A30] rounded-full"
                  style={{
                    width: `${weeklyCompletion}%`,
                  }}
                />

              </div>

            </div>

            {/* LONGEST STREAK */}

            <div className="bg-white border border-[#E5E2D9] rounded-2xl p-5 shadow-sm">

              <p className="text-base text-[#888780]">
                Longest streak
              </p>

              <p className="text-5xl text-[#2C2C2A] mt-2 font-semibold">
                {longestStreak}
              </p>

              <p className="text-base text-[#A8A69E] mt-3">
                Days in a row
              </p>

            </div>

            {/* CURRENT STREAK */}

            <div className="bg-white border border-[#E5E2D9] rounded-2xl p-5 shadow-sm">

              <p className="text-base text-[#888780]">
                Current streak
              </p>

              <p className="text-5xl text-[#2C2C2A] mt-2 font-semibold">
                {currentStreak}
              </p>

              <p className="text-base text-[#A8A69E] mt-3">
                Keep it going
              </p>

            </div>

          </div>

    
              {/* ACTIVITY HEATMAP */}
  

          <div className="w-full mb-6 bg-white border border-[#E5E2D9] rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-lg font-semibold text-[#2C2C2A]">
                  Activity
                </h2>

                <p className="text-sm text-[#888780] mt-1">
                  Your consistency over the last 25 weeks
                </p>

              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#A8A69E]">

                <span>Less</span>

                <span className="w-3.5 h-3.5 rounded-[3px] bg-[#F1EEE7]" />
                <span className="w-3.5 h-3.5 rounded-[3px] bg-[#F6D7CC]" />
                <span className="w-3.5 h-3.5 rounded-[3px] bg-[#E9AA95]" />
                <span className="w-3.5 h-3.5 rounded-[3px] bg-[#D85A30]" />

                <span>More</span>

              </div>

            </div>

            {/* 175 days = 25 weeks × 7 days */}

            <div className="w-full overflow-hidden">

              <div
                className="grid w-full"
                style={{
                  gridTemplateColumns:
                    "repeat(25, minmax(0, 1fr))",
                  gridTemplateRows:
                    "repeat(7, 18px)",
                  gap: "2px",
                }}
              >

                {heatmapData.map((item) => {

                  const maxCount =
                    Math.max(habits.length, 1);

                  let intensity =
                    "bg-[#F1EEE7]";

                  if (item.count > 0) {

                    if (
                      item.count >= maxCount
                    ) {
                      intensity =
                        "bg-[#D85A30]";
                    } else if (
                      item.count >=
                      Math.ceil(
                        maxCount * 0.66,
                      )
                    ) {
                      intensity =
                        "bg-[#E9AA95]";
                    } else {
                      intensity =
                        "bg-[#F6D7CC]";
                    }

                  }

                  return (
                    <div
                      key={item.date}
                      title={`${item.date}: ${item.count} completion${
                        item.count === 1
                          ? ""
                          : "s"
                      }`}
                      className={`w-full h-[18px] ${intensity} rounded-[3px] transition hover:scale-110`}
                    />
                  );

                })}

              </div>

            </div>

            <div className="flex justify-between text-xs text-[#A8A69E] mt-3">

              <span>
                25 weeks ago
              </span>

              <span>
                Today
              </span>

            </div>

          </div>

    
              {/* DAILY HABITS */}
  

          <div className="bg-white border border-[#E5E2D9] rounded-2xl shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-[#E5E2D9]">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-semibold">
                    Daily habits
                  </h2>

                  <p className="text-base text-[#888780] mt-1">
                    Stay consistent every day.
                  </p>

                </div>

                <span className="text-base text-[#A8A69E]">
                  This week
                </span>

              </div>

            </div>

            {/* WEEK HEADER */}

            <div className="hidden sm:grid grid-cols-[minmax(200px,1fr)_100px_280px_70px] gap-4 items-center px-6 py-4 bg-[#FCFAF7] border-b border-[#E5E2D9]">

              <span className="text-sm font-medium uppercase tracking-wide text-[#A8A69E]">
                Habit
              </span>

              <span className="text-sm font-medium uppercase tracking-wide text-[#A8A69E]">
                Streak
              </span>

              <div className="grid grid-cols-7 gap-2 text-center">

                {currentWeek.map((date) => (

                  <span
                    key={date.toISOString()}
                    className="text-sm font-medium text-[#A8A69E]"
                  >
                    {date
                      .toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                        },
                      )
                      .slice(0, 1)}
                  </span>

                ))}

              </div>

              <span />

            </div>

            <div>

              {habits.length === 0 ? (

                <div className="px-6 py-14 text-center">

                  <div className="w-14 h-14 rounded-full bg-[#FAECE7] flex items-center justify-center mx-auto mb-5 text-2xl">
                    +
                  </div>

                  <p className="text-lg font-medium">
                    No habits yet
                  </p>

                  <p className="text-base text-[#888780] mt-2">
                    Add your first habit to start
                    building your streak.
                  </p>

                  <button
                    onClick={() =>
                      setShowAddInput(true)
                    }
                    className="mt-5 text-base font-medium text-[#993C1D] hover:underline"
                  >
                    Add a habit
                  </button>

                </div>

              ) : (

                habits.map((habit, index) => {

                  const done =
                    isCompletedToday(habit);

                  // Get both streak values from one function
                  const {
                    currentStreak,
                    longestStreak,
                  } = getStreak(habit);

                  return (
                    <div
                      key={habit._id}
                      className={`group px-6 py-5 ${
                        index !==
                        habits.length - 1
                          ? "border-b border-[#E5E2D9]"
                          : ""
                      } hover:bg-[#FFFCF8] transition`}
                    >

                      <div className="grid grid-cols-1 sm:grid-cols-[minmax(200px,1fr)_100px_280px_70px] gap-4 items-center">

                        <div className="flex items-center gap-3 min-w-0">

                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() =>
                              handleToggleComplete(
                                habit._id,
                              )
                            }
                            className="w-6 h-6 accent-[#D85A30] cursor-pointer shrink-0"
                          />

                          <p
                            className={`flex-1 text-lg font-medium ${
                              done
                                ? "text-[#A8A69E] line-through"
                                : "text-[#2C2C2A]"
                            }`}
                          >
                            {habit.name}
                          </p>

                        </div>

                        <div className="text-base">

                          <span className="font-medium text-[#2C2C2A]">
                            {currentStreak}
                          </span>

                          <span className="text-[#A8A69E] ml-1">
                            day
                            {currentStreak === 1
                              ? ""
                              : "s"}
                          </span>

                        </div>

                        <div className="grid grid-cols-7 gap-2">

                          {currentWeek.map(
                            (date) => {

                              const completed =
                                isCompletedOnDate(
                                  habit,
                                  date,
                                );

                              const isToday =
                                date
                                  .toISOString()
                                  .split("T")[0] ===
                                new Date()
                                  .toISOString()
                                  .split("T")[0];

                              return (
                                <div
                                  key={date.toISOString()}
                                  title={date.toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday:
                                        "long",
                                      month:
                                        "short",
                                      day:
                                        "numeric",
                                    },
                                  )}
                                  className={`aspect-square rounded-md border flex items-center justify-center ${
                                    completed
                                      ? "bg-[#D85A30] border-[#D85A30]"
                                      : isToday
                                      ? "bg-[#FAECE7] border-[#E9AA95]"
                                      : "bg-[#F8F6F1] border-[#E8E4DB]"
                                  }`}
                                >

                                  {completed && (
                                    <span className="text-white text-sm">
                                      ✓
                                    </span>
                                  )}

                                </div>
                              );

                            },
                          )}

                        </div>

                        <button
                          onClick={() =>
                            handleDelethabit(
                              habit._id,
                            )
                          }
                          className="justify-self-end text-base text-[#A8A69E] hover:text-[#993C1D] sm:opacity-0 sm:group-hover:opacity-100 transition"
                        >
                          Delete
                        </button>

                      </div>

                      {/* Keeping the longest streak available in the habit data
                          even though the main row currently displays current streak. */}

                      <div className="hidden">
                        {longestStreak}
                      </div>

                    </div>
                  );

                })

              )}

            </div>

          </div>

          <p className="text-center text-base text-[#B0ADA5] mt-6">
            Consistency beats intensity.
          </p>

        </div>

      </div>

    </div>
  );
}

export default DashboardPAge;