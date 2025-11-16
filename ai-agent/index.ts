import figlet from "figlet";

type WebSocketData = {
  threadId: string | null;
  authToken: string;
};

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": () => {
      const body = figlet.textSync("Ai Agent Server!");
      return new Response(body);
    },
    "/chat": (req, server) => {
      const cookies = new Bun.CookieMap(req.headers.get("cookie")!);
      const authToken = cookies.get("authToken") || "";
      const threadId = new URL(req.url).searchParams.get("threadId");
      if (!!authToken) {
        return new Response("Unauthorized", { status: 401 });
      }
      const success = server.upgrade(req, {
        data: { authToken: authToken, threadId: threadId },
      });
      return success
        ? undefined
        : new Response("WebSocket upgrade error", { status: 400 });
    },
  },
  websocket: {
    // TypeScript: specify the type of ws.data like this
    data: {} as WebSocketData,
    async open(ws) {
      // open a new thread if it doesn't exists
      ws.send("Hi, how can I help you?");
    },
    async message(ws, message) {
      // here we'll invoke the ai agent
      console.log("user message: ", message);
      ws.send(`message aknowledged: ${message}`);
    },
  },
});

console.log(`Listening on ${server.url}`);
