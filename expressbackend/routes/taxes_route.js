const express = require("express");
const { connectDB } = require("../db");
const { mapTaxables } = require("../mappers/taxableMapper");

const router = express.Router();

/**
 * GET all taxables
 */
router.get("/", async (req, res) => {
  try {
    const pool = await connectDB();

    const result = await pool.request().query(`
      SELECT
        t.id AS id,
        t.taxCategory,
        t.noOfEmployee,
        t.taxableAmount,
        t.taxWithHold,
        t.incometaxPoolAmount,
        t.graduatetaxPool,
        t.graduaTotBasSalary,
        t.graduateTotaEmployee,
        t.graduatetaxWithHold,
        t.recieved_date,
        t.status,
        t.reference_number
      FROM tblTaxable t
      ORDER BY t.id DESC
    `);

    const taxables = mapTaxables(result.recordset);
    res.json(taxables);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch taxables" });
  }
});

/**
 * POST create taxable
 */
/**
 * POST create taxable
 */
router.post("/", async (req, res) => {
  try {
    const { taxable } = req.body;
    

    if (!taxable) {
      return res.status(400).json({ message: "Taxable object is required" });
    }

    const pool = await connectDB();

    const result = await pool
      .request()
      .input("reference_number", taxable.reference_number)
      .input("taxCategory", taxable.taxCategory)
      .input("noOfEmployee", taxable.noOfEmployee)
      .input("taxableAmount", taxable.taxableAmount)
      .input("taxWithHold", taxable.taxWithHold)
      .input("incometaxPoolAmount", taxable.incometaxPoolAmount)
      .input("graduatetaxPool", taxable.graduatetaxPool)
      .input("graduaTotBasSalary", taxable.graduaTotBasSalary)
      .input("graduateTotaEmployee", taxable.graduateTotaEmployee)
      .input("graduatetaxWithHold", taxable.graduatetaxWithHold)
      .input("recieved_date", taxable.recieved_date)
      .input("status", taxable.status)
      .input("maker_id", taxable.maker_id)
      .query(`
        INSERT INTO tblTaxable (
          reference_number,
          taxCategory,
          noOfEmployee,
          taxableAmount,
          taxWithHold,
          incometaxPoolAmount,
          graduatetaxPool,
          graduaTotBasSalary,
          graduateTotaEmployee,
          graduatetaxWithHold,
          recieved_date,
          status,
          maker_id
        )
        OUTPUT INSERTED.*
        VALUES (
          @reference_number,
          @taxCategory,
          @noOfEmployee,
          @taxableAmount,
          @taxWithHold,
          @incometaxPoolAmount,
          @graduatetaxPool,
          @graduaTotBasSalary,
          @graduateTotaEmployee,
          @graduatetaxWithHold,
          @recieved_date,
          @status,
          @maker_id
        )
      `);

    res.status(201).json({
      message: "Taxable created successfully",
      taxable: mapTaxables(result.recordset)[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create taxable" });
  }
});


module.exports = router;
