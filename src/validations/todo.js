import Joi from 'joi';

export const PostTodoSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
});

export const PutTodoSchema = Joi.object({
  id: Joi.string().required(),
});
