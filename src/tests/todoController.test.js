/* eslint-disable no-undef */
import {
  createTodo, getAllTodos, getTodoById, updateTodoById, deleteTodoById,
} from '../controllers/todoController';
import Todo from '../models/Todo';
import { paginateData } from '../lib/utils';

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('createTodo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new todo and return a 201 status code with success message and data', async () => {
    const req = {
      body: {
        title: 'Test Title',
        description: 'Test Description',
      },
    };

    const saveMock = jest.spyOn(Todo.prototype, 'save').mockResolvedValue({
      _id: 'testId',
      title: 'Test Title',
      description: 'Test Description',
      isCompleted: false,
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createTodo(req, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Todo created!',
      data: {
        id: 'testId',
        title: 'Test Title',
        description: 'Test Description',
        isCompleted: false,
      },
    });
  });

  it('should return a 400 status code if the title is missing from the request body', async () => {
    const req = {
      body: {
        description: 'Test Description',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const saveMock = jest.spyOn(Todo.prototype, 'save').mockResolvedValue({
      _id: 'testId',
      title: 'Test Title',
      description: 'Test Description',
      isCompleted: false,
    });

    await createTodo(req, res);
    expect(saveMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return a 500 status code and an error message if an error occurs during the process', async () => {
    const req = {
      body: {
        title: 'Test Title',
        description: 'Test Description',
      },
    };

    const saveMock = jest
      .spyOn(Todo.prototype, 'save')
      .mockRejectedValue(new Error('Test Error'));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createTodo(req, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'An error occured: Test Error',
    });
  });
});

describe('Get All Todos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get paginated todos', async () => {
    const req = { query: { page: 1, limit: 2 } };
    const res = mockResponse();

    const mockTodos = [
      { _id: '1', title: 'Todo 1' },
      { _id: '2', title: 'Todo 2' },
      { _id: '3', title: 'Todo 3' },
    ];

    Todo.find = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockTodos),
    });

    await getAllTodos(req, res);

    expect(Todo.find).toHaveBeenCalledWith({}, { __v: 0 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: paginateData(mockTodos, {
        page: 1,
        limit: 2,
      }),
    });
  });

  it('should get the 2nd page of todos', async () => {
    const req = { query: { page: 2, limit: 2 } };
    const res = mockResponse();

    const mockTodos = [
      { _id: '1', title: 'Todo 1' },
      { _id: '2', title: 'Todo 2' },
      { _id: '3', title: 'Todo 3' },
    ];

    Todo.find = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockTodos),
    });

    await getAllTodos(req, res);

    expect(Todo.find).toHaveBeenCalledWith({}, { __v: 0 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: paginateData(mockTodos, {
        page: 2,
        limit: 2,
      }),
    });
  });

  it('should handle errors when fetching todos', async () => {
    const req = { query: { page: 1, limit: 2 } };
    const res = mockResponse();

    const errorMessage = 'An error occurred';
    Todo.find.mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error(errorMessage)),
    });

    await getAllTodos(req, res);

    expect(Todo.find).toHaveBeenCalledWith({}, { __v: 0 });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: `An error occurred while fetching todos: ${errorMessage}`,
    });
  });
});

describe('Get Todo by Id', () => {
  it('should return a 200 status code and the todo object when a valid id is provided', async () => {
    const req = {
      params: {
        id: 'validId',
      },
    };
    const res = mockResponse();
    const todo = { _id: 'validId', title: 'Test Todo', completed: false };
    Todo.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(todo),
    });

    await getTodoById(req, res);

    expect(Todo.findById).toHaveBeenCalledWith('validId', { __v: 0 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: todo,
    });
  });

  it('should return a 404 status code and an error message when an invalid id is provided', async () => {
    const req = {
      params: {
        id: 'invalidId',
      },
    };
    const res = mockResponse();
    Todo.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await getTodoById(req, res);

    expect(Todo.findById).toHaveBeenCalledWith('invalidId', { __v: 0 });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Todo not found',
    });
  });

  it('should handle errors thrown by Todo.findById and return a 500 status code with an error message', async () => {
    const req = {
      params: {
        id: 'validId',
      },
    };
    const res = mockResponse();
    Todo.findById.mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error('Database error')),
    });

    await getTodoById(req, res);

    expect(Todo.findById).toHaveBeenCalledWith('validId', { __v: 0 });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'An error occurred while fetching todo: Database error',
    });
  });
});

describe('Update a todo', () => {
  it('should update a todo and return the updated todo when the todo exists', async () => {
    const req = {
      params: { id: 'todoId' },
      body: { title: 'Updated Todo' },
    };
    const res = mockResponse();

    const findByIdAndUpdateMock = jest.spyOn(Todo, 'findByIdAndUpdate').mockResolvedValueOnce({ _id: 'todoId', title: 'Updated Todo' });

    await updateTodoById(req, res);

    expect(findByIdAndUpdateMock).toHaveBeenCalledWith('todoId', { title: 'Updated Todo' }, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Todo has been updated',
      data: { _id: 'todoId', title: 'Updated Todo' },
    });
  });

  it('should return a 404 status code and an error message when the todo is not found', async () => {
    const req = {
      params: { id: 'nonExistentTodoId' },
      body: { title: 'Updated Todo' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const findByIdAndUpdateMock = jest.spyOn(Todo, 'findByIdAndUpdate').mockResolvedValueOnce(null);

    await updateTodoById(req, res);

    expect(findByIdAndUpdateMock).toHaveBeenCalledWith('nonExistentTodoId', { title: 'Updated Todo' }, { new: true });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Todo not found',
    });
  });

  it('should return a 500 status code and an error message when an error occurs while updating the todo', async () => {
    const req = {
      params: { id: 'todoId' },
      body: { title: 'Updated Todo' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const error = new Error('Update error');
    const findByIdAndUpdateMock = jest.spyOn(Todo, 'findByIdAndUpdate').mockRejectedValueOnce(error);

    await updateTodoById(req, res);

    expect(findByIdAndUpdateMock).toHaveBeenCalledWith('todoId', { title: 'Updated Todo' }, { new: true });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'An error occurred while updating todo: Update error',
    });
  });
});

describe('Delete Todo', () => {
  it('should delete a todo by ID and return a 200 status code with the deleted todo data', async () => {
    const req = {
      params: {
        id: 'todoId',
      },
    };
    const res = mockResponse();
    const deletedTodo = { _id: 'todoId', title: 'Test Todo', completed: false };
    Todo.findByIdAndDelete = jest.fn().mockResolvedValue(deletedTodo);

    await deleteTodoById(req, res);

    expect(Todo.findByIdAndDelete).toHaveBeenCalledWith('todoId');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Todo has been deleted!',
    });
  });

  it('should return a 404 status code with an error message if the todo ID is not found', async () => {
    const req = {
      params: {
        id: 'todoId',
      },
    };
    const res = mockResponse();
    Todo.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await deleteTodoById(req, res);

    expect(Todo.findByIdAndDelete).toHaveBeenCalledWith('todoId');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Todo not found',
    });
  });

  it('should return a 500 status code with an error message if an error occurs during the deletion process', async () => {
    const req = {
      params: {
        id: 'todoId',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const errorMessage = 'An error occurred';
    Todo.findByIdAndDelete = jest.fn().mockRejectedValue(new Error(errorMessage));

    await deleteTodoById(req, res);

    expect(Todo.findByIdAndDelete).toHaveBeenCalledWith('todoId');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: `An error occurred while deleting todo: ${errorMessage}`,
    });
  });
});
