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

  return (
    <div>
      <h1>Dashboard</h1>
      {habits.map((habit) => (
        <div key={habit._id}>
          <p> {habit.name} </p>
        </div>
      ))}
    </div>
  );
}

export default DashboardPAge;
