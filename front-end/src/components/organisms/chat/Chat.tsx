import { useEffect, useState, type FormEventHandler } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    import.meta.env.VITE_WSL_URL
  );
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!lastMessage) return;
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: lastMessage.data },
    ]);
  }, [lastMessage]);

  useEffect(() => {
    console.log("WebSocket connection state: ", readyState);
  }, [readyState]);

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const message = formData.get("message");
    if (message && typeof message === "string") {
      setMessages((prev) => [...prev, { role: "user", content: message }]);
      sendMessage(message);
      formElement.reset();
    }
  };

  const renderMessages = () => {
    return messages?.map((msg, index) => (
      <li
        key={`message-${index}`}
        className={`p-2 my-1 rounded-md max-w-[80%] ${
          msg.role === "user"
            ? "bg-blue-500 text-white self-end ml-auto"
            : "bg-gray-200 text-gray-800 self-start mr-auto"
        }`}
      >
        {msg.content}
      </li>
    ));
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] w-full max-w-2xl mx-auto border border-gray-300 rounded-lg shadow-md bg-white">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
        <ul className="flex flex-col">{renderMessages()}</ul>
      </div>
      <form
        onSubmit={handleFormSubmit}
        className="flex items-center border-t border-gray-300 p-3 bg-gray-50"
      >
        <input
          type="text"
          name="message"
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          disabled={readyState !== ReadyState.OPEN}
          type="submit"
          className={`ml-2 px-4 py-2 rounded-md text-white font-semibold ${
            readyState === ReadyState.OPEN
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export { Chat };
