const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB 연결 성공"))
  .catch((err) => {
    console.error("❌ MongoDB 연결 실패:", err.message);
    process.exit(1);
  });

// ✅ User 스키마 정의 (간단한 예시)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String },
});

const User = mongoose.model("User", userSchema);

// ✅ 미들웨어
app.use(cors());
app.use(bodyParser.json());

// ✅ 기본 라우트
app.get("/", (req, res) => {
  res.send("🚀 EZKorea API is running");
});

// ✅ 회원가입 API
app.post("/api/signup", async (req, res) => {
  const { email, password, name, bio } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "필수 입력값이 누락되었습니다." });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "이미 등록된 이메일입니다." });
    }

    const user = new User({ email, password, name, bio });
    await user.save();

    return res
      .status(201)
      .json({ message: "회원가입 완료", email: user.email });
  } catch (err) {
    console.error("❌ 회원가입 에러:", err);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
