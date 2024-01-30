import "./App.css";
import { useState, useEffect } from "react";
import { api } from "../src/services/index";
import axios from "axios";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoText, setEditedTodoText] = useState("");

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
      alert("Por favor, insira um título para a tarefa");
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

  const markDone = async (id: number) => {
    const newTodos = todos.map((todo: any) => {
      if (todo.id === id) {
        return { ...todo, done: !todo.done }; 
      }
      return todo;
    });

    await axios.put(`http://localhost:5555/todos/${id}`, newTodos.find((todo: any) => todo.id === id));
    setTodos(newTodos);
  };

  // EDIT
  const startEditing = (id: number, text: string) => {
    setEditingTodoId(id);
    setEditedTodoText(text);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditedTodoText("");
  };

  const updateTodo = async (id: number) => {
    const updatedTodo = {
      title: editedTodoText,
      done: todos.find((todo: any) => todo.id === id).done,
    };

    await axios.put(`http://localhost:5555/todos/${id}`, updatedTodo);
    const newTodos = todos.map((todo: any) => (todo.id === id ? { ...todo, title: editedTodoText } : todo));
    setTodos(newTodos);
    setEditingTodoId(null);
    setEditedTodoText("");
  };

  return (
    <>
      <h1>Lista de Tarefas</h1>
      <ul>
        {todos.map((todo: any) => (
          <div key={todo.id} className={`sec1 ${todo.done ? 'done' : ''}`}>
            {editingTodoId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editedTodoText}
                  onChange={(e) => setEditedTodoText(e.target.value)}
                />
                <button onClick={() => updateTodo(todo.id)}>Atualizar</button>
                <button onClick={cancelEditing}>Cancelar</button>
              </>
            ) : (
              <>
                <span className="dataContainer">
                  {todo.done ? <s>{todo.title}</s> : todo.title}
                </span>
                <button onClick={() => markDone(todo.id)}>
                  {todo.done ? "Desfazer" : "Feito"}
                </button>
                <button onClick={() => startEditing(todo.id, todo.title)}>
                  Editar
                </button>
                <button onClick={() => deleteTodo(todo.id)}>Excluir</button>
              </>
            )}
          </div>
        ))}
      </ul>
      <div className="createTodoContainer">
        <label htmlFor="">Adicione uma tarefa:</label>
        <input type="text" id="todoTitle" className="titleIpt" required />
        <button onClick={addTodo}>Adicionar Tarefa</button>
      </div>
    </>
  );
};

export default App;
