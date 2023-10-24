import { renderToString } from "react-dom/server";

const server = Bun.serve({
  hostname: "localhost",
  port: 3000,
  fetch: fetchHandler,
});
console.log(`bun running on http://${server.hostname}:${server.port}`);

type ToDo = { id: number; name: string };
let todos: ToDo[] = [];

async function fetchHandler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "" || url.pathname === "/")
    return new Response(Bun.file("index.html"));

  if (url.pathname === "/todos" && request.method == "GET") {
    return new Response(renderToString(<ToDoList todos={todos} />));
  }
  if (url.pathname === "/todos" && request.method == "POST") {
    const { todo } = await request.json();
    if (todo != "") {
      todos.push({
        id: todos.length + 1,
        name: todo,
      });
    } else {
      console.log("Task Cannot be NULL");
    }
    return new Response(renderToString(<ToDoList todos={todos} />));
}
if(url.pathname === "/clear" && request.method === "POST")
{
    todos = []
    console.log(`cleared todo ${{todos}}`); 
    return new Response(renderToString(<ToDoList todos={todos} />));
  }
  return new Response("not found", { status: 404 });
}

function ToDoList(props: { todos: ToDo[] }) {
  return (
    <>
      <ul>
        {props.todos.length
          ? props.todos.map((todo) => (
              <li key={`todo-${todo.id}`}>{todo.name}</li>
            ))
          : "Get to work!"}
      </ul>
    </>
  );
}
