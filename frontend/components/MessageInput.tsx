"use client"

import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useState } from "react";

export default function MessageInput({ onSend }: { onSend: (msg: string) => void }) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() !== "") {
      onSend({ username: username, content: message});
      setMessage("");
    }
  };

  return (
    <div className="h-full bg-zinc-700">
      <Field className="w-200 ml-50">
        <FieldLabel htmlFor="input-button-group"></FieldLabel>
        <ButtonGroup>
          <Input id="input-button-group" placeholder="Message" onChange={(e) => setMessage(e.target.value)} value={message}/>
          <Button variant="outline" onClick={handleSend}>Send</Button>
        </ButtonGroup>
      </Field>

      {/* <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="名前を入力"
        className="mr-2 p-1"
      />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="メッセージを入力"
        className="mr-2 p-1"
      /> */}
      {/* <Textarea /> */}
      {/* <button onClick={handleSend} className="p-1 bg-indigo-500 text-white">✈</button> */}
    </div>
  )
}