export default function ChatHeader({ status }: { status: string }) {
  return (
    <div className="border-b border-zinc-500 h-15 bg-zinc-700 text-zinc-300 w-full flex">
      <h1 className="text-4xl">Biscord</h1>
      <span className="justify-end">{status}</span>
    </div>
  )
}
