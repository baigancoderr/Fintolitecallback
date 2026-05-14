const express = require("express");

const router = express.Router();

const {
    createDeposit,
    callbackHandler
} = require("../controllers/depositController");

router.post("/create", createDeposit);

// BOTH GET + POST CALLBACK

router.post("/callback", callbackHandler);

router.get("/callback", callbackHandler);

module.exports = router;