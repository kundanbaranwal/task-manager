const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Cascade delete tasks when a user is deleted
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Deleting tasks for user ${this._id}`);
    await mongoose.model("Task").deleteMany({ user: this._id });
    next();
  }
);

module.exports = mongoose.model("User", userSchema);
