import express from 'express';
import { createTodo } from '../controllers/todoController';

const router = express.Router();

router.post('/', createTodo);

export default router;