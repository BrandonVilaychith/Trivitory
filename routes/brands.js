const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Brand = require("../models/Brand");
// TODO Make private
// @route   POST api/posts
// @desc    Create a brand
// @access  Private
router.post(
  "/",
  [check("name", "Please enter a brand name").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { name, active } = req.body;

    try {
      let brand = await Brand.findOne({ name });

      if (brand) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Brand already exist" }] });
      }

      name = name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      brand = new Brand({
        name,
      });

      if (!active) {
        brand.active = active;
      }

      brand.save();

      res.status(200).json({ brand });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: [{ msg: "Server Error" }] });
    }
  }
);

// TODO Make private
// @route   GET api/brands
// @desc    Get all brands
// @access  Private
router.get("/", async (req, res) => {
  // res.send("works");
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});

// TODO Make Private
// @route   DELETE api/brands/:brand_id
// @desc    Delete a brand
// @access  Private
router.delete("/:brand_id", async (req, res) => {
  const { brand_id } = req.params;
  try {
    const brand = await Brand.findById(brand_id);

    if (!brand) {
      return res.status(404).json({ errors: [{ msg: "Brand not found" }] });
    }

    await brand.deleteOne();

    res.status(200).json({ msg: "Deleted brand" });
  } catch (error) {
    console.error(error.message);

    if (error.kind === "ObjectId") {
      return res.status(404).json({ errors: [{ msg: "Brand not found" }] });
    }

    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});

// TODO Make Private
// @route   PUT api/brands/brand_id
// @desc    Edit a brand
// @access  Private
// This is update smartly
router.put("/:brand_id", async (req, res) => {
  const { brand_id } = req.params;
  try {
    Brand.findByIdAndUpdate(brand_id, req.body, { new: true }, (err, todo) => {
      if (err) {
        return res.status(500).json({ errors: [{ msg: "Brand not found" }] });
      }
      return res.status(200).json(todo);
    });
  } catch (error) {
    console.error(error.message);

    if (error.kind === "ObjectId") {
      return res.status(404).json({ errors: [{ msg: "Brand not found" }] });
    }

    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});

module.exports = router;
