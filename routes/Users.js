//Routers
const express = require("express");
const { fetchUserById,updateUser } = require("../controller/User");
const router = express.Router();
// /users are already added in base path
router.get("/:id",fetchUserById)
    //   .post("/",createUser)
      .patch("/:id",updateUser)
          ;

exports.router = router;
