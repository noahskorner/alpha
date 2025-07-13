'use client';

import { useChat } from '@ai-sdk/react';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { Markdown } from '../../../../components/markdown';

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="w-full h-full py-4 bg-sidebar flex flex-col items-end justify-between border rounded-xl stretch">
      <ScrollArea className="px-6 overflow-y-auto w-full">
        {messages.map((message) => (
          <div key={message.id} className="w-full mb-4">
            {message.parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return message.role === 'user' ? (
                    <UserMessage key={`${message.id}-${i}`} text={part.text} />
                  ) : (
                    <AssistantMessage key={`${message.id}-${i}`} text={part.text} />
                  );
              }
            })}
          </div>
        ))}
      </ScrollArea>

      <div className="w-full px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full shadow rounded-4xl min-h-24 p-2 bg-sidebar-accent"
        >
          <input
            className="w-full border-0 p-2 focus:outline-0 text-sm"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
}

export interface UserMessageProps {
  text: string;
}

function UserMessage({ text }: UserMessageProps) {
  return (
    <div className="w-full flex justify-end">
      <span className="py-2 px-4 bg-sidebar-accent rounded-2xl text-sm">{text}</span>
    </div>
  );
}

export interface AssistantMessageProps {
  text: string;
}

function AssistantMessage({ text }: AssistantMessageProps) {
  return <Markdown content={text} />;
}
