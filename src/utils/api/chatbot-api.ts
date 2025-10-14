/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = import.meta.env.VITE_API_URL;

// API utility functions for chatbot management

export interface ChatbotDto {
  _id: string;
  title: string;
  subTitle?: string;
  firstMessage?: string;
  colorCode?: string;
  imagePath?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetches all chatbots
 * @returns Promise<ChatbotDto[]> - Array of chatbots
 */
export async function getChatbots(): Promise<ChatbotDto[]> {
  try {
    if (!API_URL) {
      throw new Error("API_URL environment variable is not set");
    }

    const response = await fetch(`${API_URL}/chatbot`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chatbots: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[v0] API response data:", data);

    return data;
  } catch (error) {
    console.error("Error in getChatbots:", error);
    throw error;
  }
}

/**
 * Fetches a single chatbot by ID
 * @param id - The ID of the chatbot to fetch
 * @returns Promise<ChatbotDto> - The chatbot object
 */
export async function getChatbot(id: string): Promise<ChatbotDto> {
  try {
    if (!API_URL) {
      throw new Error("API_URL environment variable is not set");
    }

    const response = await fetch(`${API_URL}/chatbot/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chatbot: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[v0] API response data:", data);

    return data;
  } catch (error) {
    console.error("Error in getChatbot:", error);
    throw error;
  }
}

/**
 * Creates a new chatbot
 * @param payload - The chatbot data including optional file
 * @returns Promise<ChatbotDto> - The created chatbot
 */
export async function createChatbot(payload: {
  title: string;
  subTitle: string;
  firstMessage: string;
  colorCode: string;
  file?: File | null;
}): Promise<ChatbotDto> {
  try {
    if (!API_URL) {
      throw new Error("API_URL environment variable is not set");
    }

    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("subTitle", payload.subTitle);
    formData.append("firstMessage", payload.firstMessage);
    formData.append("colorCode", payload.colorCode);
    if (payload.file) {
      formData.append("file", payload.file);
    }

    const response = await fetch(`${API_URL}/chatbot`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create chatbot: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createChatbot:", error);
    throw error;
  }
}

/**
 * Updates an existing chatbot
 * @param id - The ID of the chatbot to update
 * @param payload - Partial chatbot data to update
 * @returns Promise<ChatbotDto> - The updated chatbot
 */
export async function updateChatbot(
  id: string,
  payload: Partial<{
    title: string;
    subTitle: string;
    firstMessage: string;
    colorCode: string;
    file: File | null;
  }>
): Promise<ChatbotDto> {
  try {
    if (!API_URL) {
      throw new Error("API_URL environment variable is not set");
    }

    const formData = new FormData();
    if (payload.title !== undefined) {
      formData.append("title", payload.title);
    }
    if (payload.subTitle !== undefined) {
      formData.append("subTitle", payload.subTitle);
    }
    if (payload.firstMessage !== undefined) {
      formData.append("firstMessage", payload.firstMessage);
    }
    if (payload.colorCode !== undefined) {
      formData.append("colorCode", payload.colorCode);
    }
    if (payload.file) {
      formData.append("file", payload.file);
    }

    const response = await fetch(`${API_URL}/chatbot/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to update chatbot: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in updateChatbot:", error);
    throw error;
  }
}

/**
 * Deletes a chatbot by ID
 * @param id - The ID of the chatbot to delete
 * @returns Promise<any> - Success response
 */
export async function deleteChatbot(id: string): Promise<any> {
  try {
    if (!API_URL) {
      throw new Error("API_URL environment variable is not set");
    }

    const response = await fetch(`${API_URL}/chatbot/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete chatbot: ${response.statusText}`);
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    }

    // Return success message if no JSON response
    return { success: true, message: "Chatbot deleted successfully" };
  } catch (error) {
    console.error("Error in deleteChatbot:", error);
    throw error;
  }
}
