/* eslint-disable no-undef */
import { createTodo, getAllTodos } from '../controllers/todoController';
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
