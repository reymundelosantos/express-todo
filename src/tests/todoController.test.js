import { createTodo } from "../controllers/todoController";
import Todo from "../models/Todo";

describe("createTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new todo and return a 201 status code with success message and data", async () => {
    const req = {
      body: {
        title: "Test Title",
        description: "Test Description",
      },
    };

    const saveMock = jest.spyOn(Todo.prototype, "save").mockResolvedValue({
      _id: "testId",
      title: "Test Title",
      description: "Test Description",
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
      message: "Todo created!",
      data: {
        id: "testId",
        title: "Test Title",
        description: "Test Description",
        isCompleted: false,
      },
    });
  });

  it("should return a 400 status code if the title is missing from the request body", async () => {
    const req = {
      body: {
        description: "Test Description",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const saveMock = jest.spyOn(Todo.prototype, "save").mockResolvedValue({
      _id: "testId",
      title: "Test Title",
      description: "Test Description",
      isCompleted: false,
    });

    await createTodo(req, res);
    expect(saveMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return a 500 status code and an error message if an error occurs during the process", async () => {
    const req = {
      body: {
        title: "Test Title",
        description: "Test Description",
      },
    };

    const saveMock = jest
      .spyOn(Todo.prototype, "save")
      .mockRejectedValue(new Error("Test Error"));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createTodo(req, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An error occured: Test Error",
    });
  });
});
