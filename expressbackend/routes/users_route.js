


const express = require("express");
const { connectDB } = require("../db");
const { mapUsers } = require("../mappers/userMapper");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await connectDB();

    const result = await pool.request().query(`
      SELECT
        u.id,
        u.first_name,
        u.middle_name,
        u.last_name,
        u.username,
        u.email,
        u.phone_number,
        u.status,
        u.photo_url,

        b.id AS branch_id,
        b.name AS branch_name,
        b.code AS branch_code,
        b.status AS branch_status

      FROM users u
      LEFT JOIN branch b ON b.id = u.branch_id
    `);

    const users = mapUsers(result.recordset);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
