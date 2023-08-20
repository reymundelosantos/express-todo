import Joi from "joi";

export const PostTodoSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
  });