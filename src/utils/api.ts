/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = import.meta.env.VITE_API_URL;

// API utility functions for chat functionality

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

/**
 * Fetches chat messages for a given chat ID
 * @param chatId - The ID of the chat to fetch messages for
 * @returns Promise<Message[]> - Array of messages
 */
export async function getChatApiMiddleware(chatId: string): Promise<Message[]> {
  try {
    const API_URL = import.meta.env.VITE_API_URL

    if (!API_URL) {
      throw new Error("API_URL environment variable is not set")
    }

    const response = await fetch(`${API_URL}/history/${chatId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch chat: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] API response data:", data)

    // Transform API response to match Message interface
    return (
      data.conversation?.map((msg: any, index: number) => ({
        id: msg.id || Date.now() + index,
        text: msg.messages || msg.content || msg.text || "",
        sender: msg.role === "user" ? "user" : "bot",
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      })) || []
    )
  } catch (error) {
    console.error("Error in getChatApiMiddleware:", error)
    throw error
  }
}


export async function chatApiMiddleware(messages: any) {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    return {
      role: data.role,
      content: data.content,
      id: data.id,
    };
  } catch (error) {
    console.error("Error in chat API:", error);
    throw error;
  }
}

export async function fetchChatHistories() {
  try {
    const response = await fetch(`${API_URL}/histories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chat histories:", error);
    throw error;
  }
}

export async function saveUser(payload: any) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...payload }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error in chat API:", error);
    throw error;
  }
}
