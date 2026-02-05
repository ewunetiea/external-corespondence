


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authMiddleware = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users_route");
const taxablesRoutes = require("./routes/taxes_route");
const { connectDB } = require("./db");

const app = express();

/* 🔐 Trust proxy (important for cookies in prod) */
app.set("trust proxy", 1);

/* 🔥 CORS — REQUIRED for cookie auth */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser()); // ⭐ REQUIRED

/* 🔌 DB */
connectDB()
  .then(() => console.log("Connected to SQL Server"))
  .catch(console.error);

/* 🚏 Routes */
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/taxables", taxablesRoutes);

app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/taxables", authMiddleware, taxablesRoutes);
app.use("/api/create-tax", authMiddleware, taxablesRoutes);


/* 🔒 Protected example */
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route works",
    user: req.user,
  });
});

/* 🚀 Start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
