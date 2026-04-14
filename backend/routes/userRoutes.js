import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  toggleUserStatus
} from "../controllers/userController.js";

import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/permit.js";

const router = express.Router();

/* USER */
router.get("/me", auth, getMe);
router.put("/me", auth, updateMe);

/* ADMIN */
router.get("/", auth, permit("admin"), getUsers);
router.post("/", auth, permit("admin"), createUser);
router.put("/:id", auth, permit("admin"), updateUser);
router.delete("/:id", auth, permit("admin"), deleteUser);

/* ADMIN - STATUS CONTROL */
router.patch("/toggle-status/:id", auth, permit("admin"), toggleUserStatus);

export default router;