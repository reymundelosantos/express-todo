/* eslint-disable func-names */
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

todoSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  if (update.isCompleted !== undefined) {
    if (update.isCompleted) {
      this._update.completedAt = new Date();
    } else {
      this._update.completedAt = undefined;
    }
  }

  next();
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
