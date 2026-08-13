/*
1. POST - create a new habit in the database
2. GET - get all the habits in the database
3. PATCH - update a habit like toggle today as done/undone or checked/unchecked
4. DELETE - delete a habit
*/

import express from "express";
import protectRoute from "../middleware/authMiddleware.js";
import Habits from "../models/habits.js";

const router = express.Router();

// Creating the New Habit
router.post("/", protectRoute, async (req, res) => {
  try {
    const { name } = req.body;

    const newHabit = await Habits.create({
      name,
      userId: req.userId,
    });

    res
      .status(200)
      .json({ message: "New Habit created Successfully", habit: newHabit });
  } catch (error) {
    res.status(500).json({ message: "Error creating habit", error });
  }
});

// To get all the Habits
router.get("/", protectRoute, async (req, res) => {
  try {
    const habits = await Habits.find({ userId: req.userId });
    res.status(200).json({ habits });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Habits", error });
  }
});

// To delete a habit
// we check userId too here bcoz what if a different person gets hold of someone's habit's id and tries to delete it
// checking the userId too ensures this can't happen
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const habitId = req.params.id;

    const deletedHabit = await Habits.findOneAndDelete({
      _id: habitId,
      userId: req.userId,
    });

    if (!deletedHabit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    res.status(200).json({ message: "Habit deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Habit", error });
  }
});

// To Update or Modify a Habit (toggle today's completion)
router.patch("/:id", protectRoute, async (req, res) => {
  try {
    const habitId = req.params.id;

    const updateHabit = await Habits.findOne({
      _id: habitId,
      userId: req.userId,
    });

    if (!updateHabit) {
      return res.status(404).json({ message: "Habit Not Found" });
    }

    const today = new Date().toISOString().split("T")[0];

    const alreadyCompleted = updateHabit.completedDates.some(
      (date) => date.toISOString().split("T")[0] === today,
    );

    if (alreadyCompleted) {
      updateHabit.completedDates = updateHabit.completedDates.filter(
        (date) => date.toISOString().split("T")[0] !== today,
      );
    } else {
      updateHabit.completedDates.push(new Date());
    }

    await updateHabit.save();

    res
      .status(200)
      .json({ message: "Habit Updated Successfully", habit: updateHabit });
  } catch (error) {
    res.status(500).json({ message: "Error updating habit", error });
  }
});

export default router;
