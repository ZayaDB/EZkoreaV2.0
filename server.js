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
  .connect(process.env.MONGO_URI.replace("/EZKorea", ""), {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ MongoDB 연결 성공");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(
        "MongoDB URI:",
        process.env.MONGO_URI.replace(/:([^:@]{8})[^:@]*@/, ":****@").replace(
          "/EZKorea",
          ""
        )
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
    role: {
      type: String,
      enum: ["student", "instructor", "pending_instructor"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

// 강사 신청 모델
const instructorApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  intro: String,
  career: String,
  certificate: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});
const InstructorApplication = mongoose.model(
  "InstructorApplication",
  instructorApplicationSchema
);

// 강의 모델
const courseSchema = new mongoose.Schema({
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});
const Course = mongoose.model("Course", courseSchema);

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

// 인증 미들웨어
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_super_secret_key"
    );
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
}

// Become Instructor API
app.post("/api/become-instructor", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { role: "instructor" },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    res.json({ message: "강사로 전환되었습니다.", user });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// 강사 신청 API
app.post("/api/apply-instructor", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { intro, career, certificate } = req.body;
  try {
    // 이미 신청한 경우 중복 방지
    const existing = await InstructorApplication.findOne({
      userId,
      status: "pending",
    });
    if (existing) {
      return res.status(400).json({ message: "이미 신청 내역이 있습니다." });
    }
    const application = await InstructorApplication.create({
      userId,
      intro,
      career,
      certificate,
    });
    // User role을 pending_instructor로 변경
    await User.findByIdAndUpdate(userId, { role: "pending_instructor" });
    const user = await User.findById(userId);
    res.json({ message: "신청 완료", application, user });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 강사 신청 목록 조회 (pending 상태만)
app.get("/api/admin/instructor-applications", async (req, res) => {
  try {
    const applications = await InstructorApplication.find({
      status: "pending",
    }).populate("userId", "email name");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 강사 신청 승인
app.post("/api/admin/instructor-applications/:id/approve", async (req, res) => {
  try {
    const application = await InstructorApplication.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!application)
      return res.status(404).json({ message: "신청 내역 없음" });

    // 유저 role도 instructor로 변경
    await User.findByIdAndUpdate(application.userId, { role: "instructor" });

    res.json({ message: "승인 완료", application });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 강사 신청 거절
app.post("/api/admin/instructor-applications/:id/reject", async (req, res) => {
  try {
    const application = await InstructorApplication.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!application)
      return res.status(404).json({ message: "신청 내역 없음" });
    res.json({ message: "거절 완료", application });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 모든 사용자 목록 조회 (관리자용)
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 모든 강사 목록 조회 (관리자용)
app.get("/api/admin/instructors", async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }, "-password");
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 관리자 대시보드 통계 API
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const instructorCount = await User.countDocuments({ role: "instructor" });
    const pendingInstructorCount = await InstructorApplication.countDocuments({
      status: "pending",
    });
    const courseCount = await Course.countDocuments();
    const pendingCourseCount = await Course.countDocuments({
      status: "pending",
    });

    res.json({
      userCount,
      instructorCount,
      pendingInstructorCount,
      courseCount,
      pendingCourseCount,
    });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 강의 등록 (승인된 강사만)
app.post("/api/courses", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    // 강사 권한 체크
    const user = await User.findById(userId);
    if (!user || user.role !== "instructor") {
      return res
        .status(403)
        .json({ message: "강사만 강의를 등록할 수 있습니다." });
    }
    const { title, description } = req.body;
    const course = await Course.create({
      instructorId: userId,
      title,
      description,
      status: "pending",
    });
    res.json({ message: "강의 등록 완료(승인 대기)", course });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 승인 대기 강의 목록 조회 (관리자용)
app.get("/api/admin/courses", async (req, res) => {
  try {
    const courses = await Course.find({ status: "pending" }).populate(
      "instructorId",
      "email name"
    );
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 강의 승인 (관리자용)
app.post("/api/admin/courses/:id/approve", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!course) return res.status(404).json({ message: "강의 내역 없음" });
    res.json({ message: "강의 승인 완료", course });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// ✅ 강의 거절 (관리자용)
app.post("/api/admin/courses/:id/reject", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!course) return res.status(404).json({ message: "강의 내역 없음" });
    res.json({ message: "강의 거절 완료", course });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// 관리자 인증 미들웨어
function adminAuthMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_super_secret_key"
    );
    // 관리자 이메일 확인
    if (decoded.email !== "admin@ezkorea.com") {
      return res.status(403).json({ message: "관리자 권한이 필요합니다." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
}

// 관리자 로그인 API
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== "admin@ezkorea.com") {
    return res.status(401).json({ message: "관리자 계정이 아닙니다." });
  }

  // 고정된 관리자 비밀번호 확인
  if (password !== "supersecret123") {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  // JWT 토큰 생성
  const token = jwt.sign(
    {
      email: "admin@ezkorea.com",
      name: "관리자",
      isAdmin: true,
    },
    process.env.JWT_SECRET || "your_super_secret_key",
    { expiresIn: "24h" }
  );

  return res.status(200).json({
    message: "관리자 로그인 성공",
    token,
    user: {
      email: "admin@ezkorea.com",
      name: "관리자",
      isAdmin: true,
    },
  });
});

// 기존 관리자 API에 미들웨어 적용
app.get("/api/admin/dashboard", adminAuthMiddleware, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const instructorCount = await User.countDocuments({ role: "instructor" });
    const pendingInstructorCount = await InstructorApplication.countDocuments({
      status: "pending",
    });
    const courseCount = await Course.countDocuments();
    const pendingCourseCount = await Course.countDocuments({
      status: "pending",
    });

    res.json({
      userCount,
      instructorCount,
      pendingInstructorCount,
      courseCount,
      pendingCourseCount,
    });
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

app.get(
  "/api/admin/instructor-applications",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const applications = await InstructorApplication.find({
        status: "pending",
      }).populate("userId", "email name");
      res.json(applications);
    } catch (err) {
      res.status(500).json({ message: "서버 오류" });
    }
  }
);

app.post(
  "/api/admin/instructor-applications/:id/approve",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const application = await InstructorApplication.findByIdAndUpdate(
        req.params.id,
        { status: "approved" },
        { new: true }
      );
      if (!application)
        return res.status(404).json({ message: "신청 내역 없음" });

      // 유저 role도 instructor로 변경
      await User.findByIdAndUpdate(application.userId, { role: "instructor" });

      res.json({ message: "승인 완료", application });
    } catch (err) {
      res.status(500).json({ message: "서버 오류" });
    }
  }
);

app.post(
  "/api/admin/instructor-applications/:id/reject",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const application = await InstructorApplication.findByIdAndUpdate(
        req.params.id,
        { status: "rejected" },
        { new: true }
      );
      if (!application)
        return res.status(404).json({ message: "신청 내역 없음" });
      res.json({ message: "거절 완료", application });
    } catch (err) {
      res.status(500).json({ message: "서버 오류" });
    }
  }
);

app.get("/api/admin/users", adminAuthMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

app.get("/api/admin/instructors", adminAuthMiddleware, async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }, "-password");
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

app.get("/api/admin/courses", adminAuthMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({ status: "pending" }).populate(
      "instructorId",
      "email name"
    );
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

app.post(
  "/api/admin/courses/:id/approve",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const course = await Course.findByIdAndUpdate(
        req.params.id,
        { status: "approved" },
        { new: true }
      );
      if (!course) return res.status(404).json({ message: "강의 내역 없음" });
      res.json({ message: "강의 승인 완료", course });
    } catch (err) {
      res.status(500).json({ message: "서버 오류" });
    }
  }
);

app.post(
  "/api/admin/courses/:id/reject",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const course = await Course.findByIdAndUpdate(
        req.params.id,
        { status: "rejected" },
        { new: true }
      );
      if (!course) return res.status(404).json({ message: "강의 내역 없음" });
      res.json({ message: "강의 거절 완료", course });
    } catch (err) {
      res.status(500).json({ message: "서버 오류" });
    }
  }
);
