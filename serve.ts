import Server from "lume/core/server.ts";
import not_found from "lume/middlewares/not_found.ts";

const server = new Server({
  port: 8000,
  root: `${Deno.cwd()}/_site`,
});

server.start();

server.use(
  not_found({
    page404: "/404/",
    root: `${Deno.cwd()}/_site`,
    directoryIndex: false,
  })
);

console.log("Listening on http://localhost:8000");
