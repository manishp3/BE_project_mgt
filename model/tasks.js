const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    pro_ref: {
      // type:mongoose.Schema.Types.ObjectId,
      // ref:"project"
      type: mongoose.Schema.Types.ObjectId,
      ref: "project"
    },
    label: {
      type: String,
      required: [true, "Enter Title of Task"],
    },
    assign_to: {
      // type: String,
      // TODO: i think it only assign to signe user only
      type: mongoose.Schema.Types.ObjectId,
      ref: "signup"
    },
    summary: {
      type: String,
    },
    due_date: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["Low", "Normal", "High"]
    },
    image: {
      type: String,
      // data: Buffer,
      // contentType: String,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do"
    }
  },
  { timestamps: true }
);

const task_tbl = mongoose.model("task", taskSchema);

module.exports = task_tbl;
