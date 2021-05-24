import React, { useEffect, useReducer } from "react";
import TodosList from "./TodosList";
import AddTodoForm from "./AddTodoForm";
import { todosReducer } from "../reducers/todosReducer";
import { TodosDispatchContext } from "../context/TodosDispatchContext";
import { useIsMounted } from "../hooks/useIsMounted";

/*
const initialTodos = [
  {
    text: "Forkez et cloner ce repo",
    isCompleted: true,
    id: "1b688c51-e990-4ce3-95a5-9018cf81d23d",
  },
  {
    text: "Refactor todos avec useReducer",
    isCompleted: false,
    id: "efc6331d-7ca2-49a6-b014-378b8280b33d",
  },
  {
    text: "Add dispatch to Context",
    isCompleted: false,
    id: "9e60d353-cd72-40bb-97e6-5841e51635c0",
  },
  {
    text: "Add Color Mode Context",
    isCompleted: false,
    id: "df0ce18c-b4fa-4651-82c0-72fad6b486e4",
  },
]
*/

const initialState = {
  todos: [],
  loading: false,
  error: "",
};

const Todos = () => {
  const [state, dispatch] = useReducer(todosReducer, initialState);
  const { todos, loading, error } = state;
  const isMounted = useIsMounted();
  console.log(isMounted);

  useEffect(() => {
    dispatch({ type: "FETCH_INIT" });
    fetch(`${process.env.REACT_APP_API_URL}/todos`)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`Something went wrong: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        if (isMounted.current) {
          dispatch({ type: "FETCH_SUCCESS", payload: result });
        }
      })
      .catch((error) => {
        if (isMounted.current) {
          dispatch({ type: "FETCH_FAILURE", payload: error.message });
        }
      });
  }, [isMounted]);

  return (
    <main>
      {error && <p className="alert alert-danger">{error}</p>}
      <h2 className="text-center pb-3 pt-3">
        Ma liste de tâches : <span className="text-success">{todos.length}</span>
      </h2>
      <TodosDispatchContext.Provider value={dispatch}>
        <TodosList todos={todos} />
        <AddTodoForm />
        {loading && <p>Loading...</p>}
      </TodosDispatchContext.Provider>
    </main>
  );
};

export default Todos;
