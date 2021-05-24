import { useTodosDispatch } from "../context/TodosDispatchContext";
import { useIsMounted } from "../hooks/useIsMounted";

const ToggleTodo = ({ todo }) => {
  const dispatch = useTodosDispatch();
  const isMounted = useIsMounted();

  const toggleCompleteTodo = () => {
    fetch(`${process.env.REACT_APP_API_URL}/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...todo,
        isCompleted: !todo.isCompleted,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`something went wrong ${response.statusText}`);
        }
        return response.json();
      })
      .then(() => {
        if (isMounted.current) {
          dispatch({ type: "TOGGLE", payload: todo }); //result
        }
      })
      .catch((error) => {
        if (isMounted.current) {
          dispatch({ type: "FETCH_FAILURE", payload: error.message });
        }
      });
  };
  return (
    <button
      className={`btn btn-md ${todo.isCompleted ? "btn-dark" : "btn-light"}`}
      type="button"
      onClick={toggleCompleteTodo}
    >
      {todo.isCompleted ? "Rétablir" : "Terminer"}
    </button>
  );
};

export default ToggleTodo;
