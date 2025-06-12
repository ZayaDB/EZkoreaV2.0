const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "이메일은 필수입니다."],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "비밀번호는 필수입니다."],
    minlength: [6, "비밀번호는 최소 6자 이상이어야 합니다."],
  },
  name: {
    type: String,
    required: [true, "이름은 필수입니다."],
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "instructor", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 비밀번호 해싱 미들웨어
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 비밀번호 확인 메서드
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
