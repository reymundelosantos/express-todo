import mongoose from 'mongoose';
import Todo from '../src/models/Todo';

describe('Todo Model Unit Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Todo.deleteMany({});
  });

  it('should save a valid todo', async () => {
    const todoData = {
      title: 'Test Todo',
      description: 'Testing todo functionality',
      isCompleted: false,
    };
    const todo = new Todo(todoData);
    const savedTodo = await todo.save();

    expect(savedTodo._id).toBeDefined();
    expect(savedTodo.title).toBe(todoData.title);
    expect(savedTodo.description).toBe(todoData.description);
    expect(savedTodo.isCompleted).toBe(todoData.isCompleted);
  });

  it('should update completedAt when isCompleted is set to true', async () => {
    const todoData = {
      title: 'Test Todo',
      description: 'Testing todo functionality',
      isCompleted: false,
    };
    const todo = new Todo(todoData);
    await todo.save();

    await Todo.findOneAndUpdate({ _id: todo._id }, { isCompleted: true });

    const updatedTodo = await Todo.findById(todo._id);
    expect(updatedTodo.isCompleted).toBe(true);
    expect(updatedTodo.completedAt).toBeInstanceOf(Date);
  });

  it('should unset completedAt when isCompleted is set to false', async () => {
    const todoData = {
      title: 'Test Todo',
      description: 'Testing todo functionality',
      isCompleted: true,
    };
    const todo = new Todo(todoData);
    await todo.save();

    await Todo.findOneAndUpdate({ _id: todo._id }, { isCompleted: false });

    const updatedTodo = await Todo.findById(todo._id);
    expect(updatedTodo.isCompleted).toBe(false);
    expect(updatedTodo.completedAt).toBe(undefined);
  });
});
