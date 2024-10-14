import express from 'express';
import { UserController } from '../controller/index.js';
import verifyToken from "../middleware/verifyToken.js";
import checkRole from '../middleware/authorization.js';

const userRouter = express.Router();
userRouter.put('/change-password', verifyToken, UserController.changePassword);

export default userRouter;