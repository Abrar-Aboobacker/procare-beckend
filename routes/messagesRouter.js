const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  userAddMessage,
  getAllMessages,
} = require("../controller/message-controller");

router.post("/addMessage", userAddMessage);
router.post("/getAllMessages", getAllMessages);
module.exports = router;
