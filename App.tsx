import "./App.css";
import { useState, useEffect } from "react";
import { api } from "../src/services/index";
import axios from "axios";

const App = () => {
  const [todos, setTodos] = useState([]);

  // MÉTODOS: GET, POST, DELETE, UPDATE

  // GET
  useEffect(() => {
    api.get("http://localhost:5555/todos").then((response) => {
      setTodos(response.data);
    });
  }, []);


  // POST
  const addTodo = async () => {
    const todoTitle = document.getElementById("todoTitle") as HTMLInputElement;


    const title = todoTitle.value.trim();
    const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);

    const newTodo = {
      title: capitalizedTitle,
      done: false,
    };

    if (title === "") {
      alert("Please enter a to-do title");
    } else {
      await api.post("http://localhost:5555/todos", newTodo);
      const response = await api.get("http://localhost:5555/todos");
      setTodos(response.data);
      todoTitle.value = "";
    }
  };



  // DELETE
  const deleteTodo = async (id: number) => {
    await axios.delete(`http://localhost:5555/todos/${id}`);
    const newTodos = todos.filter((todo: any) => todo.id !== id);
    setTodos(newTodos);
  };

  // UPDATE (renomeado para markDone)
  const markDone = async (id: number) => {
    const newTodos = todos.map((todo: any) => {
      if (todo.id === id) {
        return { ...todo, done: !todo.done }; // Alterna entre feito e não feito
      }
      return todo;
    });

    await axios.put(`http://localhost:5555/todos/${id}`, newTodos.find((todo: any) => todo.id === id));
    setTodos(newTodos);
  };

  return (
    <>

      <h1>To-Do List</h1>
      <ul>
        {todos.map((todo: any) => (
          <div key={todo.id} className={`sec1 ${todo.done ? 'done' : ''}`}>
            <span className="dataContainer">{todo.done ? <s>{todo.title}</s> : todo.title}</span>
            <button onClick={() => markDone(todo.id)}>{todo.done ? "Desfazer" : "Feito"}</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        ))}
      </ul>
      <div className="createTodoContainer">
        <label htmlFor="">Adicione uma tarefa:    </label>
        <input type="text" id="todoTitle" className="titleIpt" required />
        <button onClick={addTodo}>Add To-Do</button>
      </div>
    </>
  );
};

export default App;
