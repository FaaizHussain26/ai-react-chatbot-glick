/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = import.meta.env.VITE_API_URL;

export function convertToOpenAIMessages(messages: any[]): any[] {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export async function chatFetchFunction({ body }: { body: any }) {
  const { messages } = JSON.parse(body);

  const openaiMessages = convertToOpenAIMessages(messages);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: openaiMessages }),
  });

  if (!response.ok) {
    throw new Error(`Backend responded with status: ${response.status}`);
  }

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
