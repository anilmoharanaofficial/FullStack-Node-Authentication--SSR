import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Name is required"],
      minLength: [5, "Name must be at least 5 charchter"],
      maxLength: [50, "Name should be less that 50 charchter"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minLength: [8, "Password must be at least 8 charchter"],
    },
  },
  {
    timestamps: true,
  }
);

// Password Encryption
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//JWT Token...............
userSchema.statics.generateJWTToken = async function () {
  try {
    if (!this._id || !this.email || !this.userName) {
      throw new Error("Missing user details");
    }

    const token = await JWT.sign(
      {
        id: this._id,
        email: this.email,
        name: this.userName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    return token;
  } catch (error) {
    throw new Error("Error generating JWT token");
  }
};

userSchema.statics.comparePassword = async function (plainTextPassword) {
  try {
    return await bcrypt.compare(plainTextPassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Creating User Model
const User = model("User", userSchema);

export default User;
