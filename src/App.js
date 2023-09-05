import React, { useState, useEffect } from "react";
import "./App.css";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

//  ======================== For modal ===============================
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 7;
  const [open, setOpen] = useState(false);
  const showTodoDetails = (todo) => {
    setSelectedTodo(todo);
    setOpen(true);
  };
  const hideTodoDetails = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: "DELETE",
      });

      //  ========================Filter out the deleted todo from the list===============================
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));

      setSelectedTodo("");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  //  ========================Calculate the current todos for the current page===============================
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  //  ========================Function to handle page change===============================
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-96 mx-auto mt-8">
      <h1 className="text-red-500 text-2xl font-semibold mb-4">Todos</h1>
      <ul className="list-none p-0">
        {currentTodos.map((todo) => (
          <li key={todo.id} className="bg-white border border-gray-300 my-2 p-4 rounded-lg flex justify-between items-center font-[poppins]">
            <div onClick={() => showTodoDetails(todo)} className="todo cursor-pointer">
              {todo.id + ", " + todo.title}
            </div>
            <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 cursor-pointer" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <button className={`prev-button ${currentPage === 1 && "disabled"}`} onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          className={`next-button ${indexOfLastTodo >= todos.length && "disabled"}`}
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastTodo >= todos.length}
        >
          Next
        </button>
      </div>

      {/* ========================Modal for show details every todos=============================== */}

      <BootstrapDialog onClose={hideTodoDetails} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <h2>Todo Details</h2>
        </DialogTitle>
        <DialogContent dividers>
          <div className="font-[poppins]">
            <p>
              <span className="font-semibold">ID:</span> {selectedTodo.id}
            </p>
            <p>
              <span className="font-semibold">Title:</span> {selectedTodo.title}
            </p>
            <p>
              {" "}
              <span className="font-semibold">Completed:</span> {selectedTodo.completed ? "Yes" : "No"}
            </p>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}

export default App;
