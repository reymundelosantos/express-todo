/* eslint-disable consistent-return */
import Todo from '../models/Todo';
import { PostTodoSchema } from '../validations/todo';
import { paginateData } from '../lib/utils';

export const createTodo = async (req, res) => {
  try {
    const { error } = PostTodoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const newTodo = new Todo({
      ...req.body,
    });
    const {
      _id: id, title, description, isCompleted,
    } = await newTodo.save();
    res.status(201).json({
      success: true,
      message: 'Todo created!',
      data: {
        id,
        title,
        description,
        isCompleted,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `An error occured: ${error.message}`,
    });
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const todos = await Todo.find({}, { __v: 0 }).lean();
    const data = paginateData(todos, options);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `An error occurred while fetching todos: ${error.message}`,
    });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id, { __v: 0 }).lean();

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `An error occurred while fetching todo: ${error.message}`,
    });
  }
};

export const updateTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
    });

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo has been updated',
      data: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `An error occurred while updating todo: ${error.message}`,
    });
  }
};

export const deleteTodoById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo has been deleted!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `An error occurred while deleting todo: ${error.message}`,
    });
  }
};
