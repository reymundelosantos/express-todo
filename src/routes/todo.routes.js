import express from 'express';
import { createTodo, getAllTodos, getTodoById } from '../controllers/todoController';
import validateObjectId from '../lib/middlewares/validateObjectId';

const router = express.Router();

router.post('/', createTodo);
router.get('/', getAllTodos);
router.get('/:id', [validateObjectId], getTodoById);

export default router;
