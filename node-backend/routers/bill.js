const express = require('express');
const Bill = require('../models/area');
const authCheck = require('../middleware/authCheck');

const router = express.Router();

const url = "/api/bills";

router.get(url, authCheck, (req, res, next) => {
  Bill.find().then(documents => {
    res.status(200).json({
      message: "Bills fetched successfully!",
      bills: documents
    });
  });
});

module.exports = router;
