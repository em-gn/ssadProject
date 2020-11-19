const mongoose = require("mongoose");
const _ = require("lodash");
const arr = require("../../utils/stats");

const groupSchema = new mongoose.Schema(
  {
    groupID: {
      type: Number,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    students: [
      {
        _id: false,
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { strict: false }
);

groupSchema.methods.getNumStudents = function () {
  if (!this.students) return 0;
  return this.students.length;
};

groupSchema.methods.getBoxPlotStats = async function () {
  const group = await Group.findOne({ groupID: this.groupID }).populate(
    "students.student",
    "score"
  );
  // console.log(group);
  const stats = {};
  group.students.forEach((student) => {
    student.student.score.forEach((world) => {
      if (!stats[world.worldID]) stats[world.worldID] = {};
      world.levels.forEach((level, index) => {
        if (!stats[world.worldID][index]) stats[world.worldID][index] = [level];
        else {
          stats[world.worldID][index] = stats[world.worldID][index].concat([
            level,
          ]);
        }
      });
    });
  });

  const data = [];
  Object.keys(stats).forEach((world) => {
    Object.keys(stats[world]).forEach((level) => {
      const toBePushed = {};
      const currArr = stats[world][level];

      toBePushed["x"] = `World: ${world}-` + (parseInt(level) + 1).toString();
      toBePushed["low"] = arr.min(currArr);
      toBePushed["q1"] = arr.getPercentile(currArr, 25);
      toBePushed["median"] = arr.median(currArr);
      toBePushed["q3"] = arr.getPercentile(currArr, 75);
      toBePushed["high"] = arr.max(currArr);
      data.push(toBePushed);
    });
  });
  return data;
};

groupSchema.methods.getCompletionRate = function () {
  const numStudents = this.getNumStudents();
  if (numStudents === 0) {
    return "0";
  }
  let completedStudents = 0;
  this.students.forEach((student) => {
    if (student.completed) completedStudents++;
  });
  return {
    completionRate: ((completedStudents / numStudents) * 100).toPrecision(3),
    completedStudents,
    numStudents,
  };
};

groupSchema.methods.getAverageScore = async function () {
  const group = await Group.findOne({ groupID: this.groupID }).populate(
    "students.student",
    "score"
  );
  let totalScore = 0;
  if (!group.students) return 0;

  group.students.forEach((student) => {
    if (student.student) {
      student.student.score.forEach((score) => {
        totalScore += score.levels.reduce((acc, val) => (acc += val), 0);
      });
    }
  });
  return Math.floor(totalScore / this.getNumStudents());
};

groupSchema.methods.getAverageMinutes = async function () {
  const group = await Group.findOne({ groupID: this.groupID }).populate(
    "students.student",
    "score"
  );
  group.students.forEach((s) => {
    console.log(s.student.score);
  });
  let totalTime = 0;
  if (!group.students) return 0;

  group.students.forEach((student) => {
    if (student.student) {
      student.student.score.forEach((score) => {
        totalTime += score.time.reduce((acc, val) => (acc += val), 0);
      });
    }
  });
  return (totalTime / this.getNumStudents() / 60.0).toPrecision(3);
};

groupSchema.methods.getScoreByWorld = async function () {
  const worldArr = [0, 0, 0, 0, 0];
  const group = await Group.findOne({ groupID: this.groupID }).populate(
    "students.student",
    "score"
  );
  if (!group.students) return worldArr;

  group.students.forEach((student) => {
    if (student.student) {
      student.student.score.forEach((score, index) => {
        worldArr[index] += score.levels.reduce((acc, val) => (acc += val), 0);
      });
    }
  });
  return { [this.getNumStudents()]: worldArr };
};
const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
