import { useIsMounted } from "../hooks/useIsMounted";
import { useTodosDispatch } from "../context/TodosDispatchContext";
//import { v4 as uuidv4 } from "uuid";
import { useDarkMode } from "../context/DarkModeContext";

const AddTodoForm = () => {
  const darkMode = useDarkMode();
  const darkModeClass = darkMode ? "text-white bg-dark" : "";
  const dispatch = useTodosDispatch();
  const isMounted = useIsMounted();
  /*
  const addTodo = (text) => {
    const newTodo = {
      text,
      isCompleted: false,
      id: uuidv4(),
    };
    dispatch({ type: "ADD", payload: newTodo });
  };
*/
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const newTodoText = event.target.elements.todo.value;
    //addTodo(newTodoText);
    dispatch({ type: "FETCH_INIT" });

    fetch(`${process.env.REACT_APP_API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodoText, //text: "Add new todo via API,"
        isCompleted: false,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Something went wrong: ${response.textStatus}`);
        }
        return response.json();
      })
      .then((result) => {
        if (isMounted.current) {
          dispatch({ type: "ADD", payload: result });
        }
      })
      .catch((error) => {
        if (isMounted.current) {
          dispatch({ type: "FETCH_FAILURE", payload: error.message });
        }
      });
    event.target.reset();
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="input-group input-group-md pt-2 d-flex">
        <label htmlFor="todo">
          <button type="submit" aria-label="Ajoutez une tâche" className="btn btn-success shadow-sm border">
            Ajouter une tâche
          </button>
        </label>
        <input className={`shadow-sm border form-control rounded ${darkModeClass}`} id="todo" required />
      </div>
    </form>
  );
};
export default AddTodoForm;
