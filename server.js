const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS 설정
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://ezkoreav20-production.up.railway.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ MongoDB 연결 성공");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(
        "MongoDB URI:",
        process.env.MONGO_URI.replace(/:([^:@]{8})[^:@]*@/, ":****@")
      );
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB 연결 실패:", err.message);
    process.exit(1);
  });

// ✅ User 스키마 정의
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "이메일은 필수입니다"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "비밀번호는 필수입니다"],
      minlength: [6, "비밀번호는 최소 6자 이상이어야 합니다"],
    },
    name: {
      type: String,
      required: [true, "이름은 필수입니다"],
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

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
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "이미 등록된 이메일입니다." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      bio,
    });

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "회원가입 완료",
      user: userResponse,
    });
  } catch (err) {
    console.error("❌ 회원가입 에러:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(err.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// ✅ 로그인 API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "이메일과 비밀번호를 입력해주세요." });
  }

  try {
    // 사용자 찾기
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 일치하지 않습니다." });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET || "your_super_secret_key",
      { expiresIn: "24h" }
    );

    // 응답에서 비밀번호 제외
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: "로그인 성공",
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error("❌ 로그인 에러:", err);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});
