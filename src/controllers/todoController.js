import Todo from "../models/Todo";
import { PostTodoSchema } from "../validations/todo";

export const createTodo = async (req, res) => {
  try {
    const { error } = PostTodoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const newTodo = new Todo({
      ...req.body,
    });
    const { _id: id, title, description, isCompleted } = await newTodo.save();
    res.status(201).json({
      success: true,
      message: "Todo created!",
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


