const mongoose = require("mongoose");

const storySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "public",
      enum: ["public", "private"],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoogleUser",
      required: true,
    },
    image: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
