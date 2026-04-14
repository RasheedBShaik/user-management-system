import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getMe
} from "../controllers/userController.js";

import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/permit.js";

const router = express.Router();

router.get("/", auth, permit("admin"), getUsers);
router.post("/", auth, permit("admin"), createUser);
router.put("/:id", auth, permit("admin"), updateUser);
router.delete("/:id", auth, permit("admin"), deleteUser);

router.get("/me", auth, getMe);

export default router;