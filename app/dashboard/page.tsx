"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

function DashboardPAge() {
  const [habits, setHabits] = useState([]);
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
      <pre>{JSON.stringify(habits, null, 2)}</pre>
    </div>
  );
}

export default DashboardPAge;
