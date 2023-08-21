import express from 'express';
import {
  createTodo, getAllTodos, getTodoById, updateTodoById,
} from '../controllers/todoController';
import validateObjectId from '../lib/middlewares/validateObjectId';

const router = express.Router();

router.post('/', createTodo);
router.get('/', getAllTodos);
router.get('/:id', [validateObjectId], getTodoById);
router.put('/:id', [validateObjectId], updateTodoById);

export default router;
