import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import { config } from "../config/config.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.authProvider; // Password is required only if not using OAuth
      },
    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/demo/image/upload/v1493119560/sample.jpg",
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    authProviderId: {
      type: String,
      sparse: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["Free", "Pro", "Business"],
        default: "Free",
      },
      validUntil: {
        type: Date,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.AccessTokenGenerator = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    config.jwt.accessTokenSecret,
    {
      expiresIn: config.jwt.accessTokenExpiresIn,
    },
  );
};

export const User = mongoose.model("User", userSchema);
