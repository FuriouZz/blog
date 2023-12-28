import { Server } from "./deps/lume.ts";

const server = new Server({
  port: 8000,
  root: `${Deno.cwd()}/.lume/_site`,
});

server.start();

console.log("Listening on http://localhost:8000");
