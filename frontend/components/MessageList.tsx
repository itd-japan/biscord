export default function MessageList({ messages }: { messages: string[] }) {
  console.log(messages);
  return (
    <div className="h-150 overflow-auto bg-zinc-700">
      <ul>
        {messages.map((msg, index) => (
          <li key={index} className="border-t border-zinc-500 text-zinc-300">
            {msg.split(":")[0]}
            <br/>{msg.split(":")[1]}
          </li>
        ))}
      </ul>
    </div>
  );
}
