
// // const express = require("express");
// // const router = express.Router();
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");
// // require("dotenv").config();

// // const { connectDB } = require("../db");


// // // ================= REGISTER =================
// // router.post("/register", async (req, res) => {
// //   const { email, password } = req.body;

// //   if (!email || !password)
// //     return res.status(400).json({ message: "Email and password are required" });

// //   try {
// //     const pool = await connectDB();

// //     // check if user exists
// //     const existingUser = await pool
// //       .request()
// //       .input("email", email)
// //       .query("SELECT id FROM Users WHERE email = @email");

// //     if (existingUser.recordset.length > 0) {
// //       return res.status(400).json({ message: "User already exists" });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     await pool
// //       .request()
// //       .input("email", email)
// //       .input("password", hashedPassword)
// //       .query(
// //         "INSERT INTO Users (email, password) VALUES (@email, @password)"
// //       );

// //     res.json({ message: "User registered successfully" });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });


// // // ================= LOGIN =================
// // router.post("/login", async (req, res) => {
// //   const { email, password } = req.body;

// //   try {
// //     const pool = await connectDB();

// //     const result = await pool
// //       .request()
// //       .input("email", email)
// //       .query("SELECT * FROM [user] WHERE email = @email");

// //     if (result.recordset.length === 0) {
// //       return res.status(400).json({ message: "Invalid email or password" });
// //     }

// //     const user = result.recordset[0];

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: "Invalid email or password" });
// //     }

// //     const token = jwt.sign(
// //       { id: user.id, email: user.email, role: user.role },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "1h" }
// //     );

// //     res.json({
// //       token,
// //       user: {
// //         id: user.id,
// //         email: user.email,
// //         role: user.role,
// //       },
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { connectDB } = require("../db");
// const {
//   signAccessToken,
//   signRefreshToken,
// } = require("../utils/tokens");

// // ================= LOGIN =================
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const pool = await connectDB();

//     const result = await pool
//   .request()
//   .input("email", email)
//   .query(`
//     SELECT 
//       u.id,
//       u.email,
//       u.password,
//       r.name AS role
//     FROM [user] u
//     INNER JOIN user_role ur ON ur.user_id = u.id
//     INNER JOIN role r ON r.id = ur.role_id
//     WHERE u.email = @email
//   `);


//     if (!result.recordset.length)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const user = result.recordset[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const accessToken = signAccessToken(user);
//     const refreshToken = signRefreshToken(user);

//     // 🍪 SET COOKIES
//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       sameSite: "strict",
//       secure: false, // true in production (HTTPS)
//       maxAge: 15 * 60 * 1000,
//     });

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       sameSite: "strict",
//       secure: false,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.json({
//       user: { id: user.id, email: user.email, role: user.role },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ================= REFRESH =================
// router.post("/refresh", (req, res) => {
//   const refreshToken = req.cookies?.refreshToken;
//   if (!refreshToken) return res.sendStatus(401);

//   try {
//     const decoded = jwt.verify(
//       refreshToken,
//       process.env.JWT_REFRESH_SECRET
//     );

//     const accessToken = jwt.sign(
//       { id: decoded.id },
//       process.env.JWT_ACCESS_SECRET,
//       { expiresIn: "15m" }
//     );

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       sameSite: "strict",
//       secure: false,
//       maxAge: 15 * 60 * 1000,
//     });

//     res.sendStatus(200);
//   } catch {
//     res.sendStatus(403);
//   }
// });

// // ================= LOGOUT =================
// router.post("/logout", (req, res) => {
//   res.clearCookie("accessToken");
//   res.clearCookie("refreshToken");
//   res.sendStatus(200);
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connectDB } = require("../db");
const {
  signAccessToken,
  signRefreshToken,
} = require("../utils/tokens");

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("email", email)
      .query(`
        SELECT 
          u.id,
          u.email,
          u.password,
          r.name AS role
        FROM users u
        INNER JOIN user_role ur ON ur.user_id = u.id
        INNER JOIN role r ON r.id = ur.role_id
        WHERE u.email = @email
      `);

    if (!result.recordset.length)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // 🍪 ACCESS TOKEN
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in prod
      maxAge: 15 * 60 * 1000,
    });

    // 🍪 REFRESH TOKEN
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= REFRESH ================= */
router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(403);
  }
});

/* ================= LOGOUT ================= */
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.sendStatus(200);
});

module.exports = router;
