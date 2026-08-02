import mongoose from "mongoose";

const habitSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    completedDates: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

const Habits = mongoose.model("Habit", habitSchema);

export default Habits;
