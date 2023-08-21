/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

todoSchema.virtual('id').get(() => this._id);

todoSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id; // Remove _id field
    delete ret.__v; // Remove __v field
  },
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
