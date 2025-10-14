/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = import.meta.env.VITE_API_URL;

// API utility functions for knowledge management

export interface KnowledgeDto {
  _id: string;
  title: string;
  chatbotId?: string;
  extractionStatus?: string;
  originalFilePath?: string;
  originalFileName?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetches all knowledge entries
 * @returns Promise<KnowledgeDto[]> - Array of knowledge entries
 */
export async function getKnowledgeList(): Promise<KnowledgeDto[]> {
  try {
    if (!API_URL) {
      throw new Error("API_URL environment variable is not set");
    }

    const response = await fetch(`${API_URL}/knowledge`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch knowledge: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[v0] API response data:", data);

    return data;
  } catch (error) {
    console.error("Error in getKnowledgeList:", error);
    throw error;
  }
}

/**
 * Fetches a single knowledge entry by ID
 * @param id - The ID of the knowledge entry to fetch
 * @returns Promise<KnowledgeDto> - The knowledge entry object
 */
export async function getKnowledge(id: string): Promise<KnowledgeDto> {
  try {
    if (!API_URL) {
      throw new Error("API_URL environment variable is not set");
    }

    const response = await fetch(`${API_URL}/knowledge/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch knowledge: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[v0] API response data:", data);

    return data;
  } catch (error) {
    console.error("Error in getKnowledge:", error);
    throw error;
  }
}

/**
 * Creates a new knowledge entry with file upload
 * @param payload - The knowledge data including title, chatbotId, and file
 * @returns Promise<KnowledgeDto> - The created knowledge entry
 */
export async function createKnowledge(payload: {
  title: string;
  chatbotId: string;
  file: File;
}): Promise<KnowledgeDto> {
  try {
    if (!API_URL) {
      throw new Error("API_URL environment variable is not set");
    }

    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("chatbotId", payload.chatbotId);
    formData.append("file", payload.file);

    const response = await fetch(`${API_URL}/knowledge/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create knowledge: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createKnowledge:", error);
    throw error;
  }
}

/**
 * Updates an existing knowledge entry
 * @param id - The ID of the knowledge entry to update
 * @param payload - Partial knowledge data to update
 * @returns Promise<KnowledgeDto> - The updated knowledge entry
 */
export async function updateKnowledge(
  id: string,
  payload: Partial<{
    title: string;
    chatbotId: string;
    file: File | null;
  }>
): Promise<KnowledgeDto> {
  try {
    if (!API_URL) {
      throw new Error("API_URL environment variable is not set");
    }

    const formData = new FormData();
    if (payload.title !== undefined) {
      formData.append("title", payload.title);
    }
    if (payload.chatbotId !== undefined) {
      formData.append("chatbotId", payload.chatbotId);
    }
    if (payload.file) {
      formData.append("file", payload.file);
    }

    const response = await fetch(`${API_URL}/knowledge/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to update knowledge: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in updateKnowledge:", error);
    throw error;
  }
}

/**
 * Deletes a knowledge entry by ID
 * @param id - The ID of the knowledge entry to delete
 * @returns Promise<any> - Success response
 */
export async function deleteKnowledge(id: string): Promise<any> {
  try {
    if (!API_URL) {
      throw new Error("API_URL environment variable is not set");
    }

    const response = await fetch(`${API_URL}/knowledge/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete knowledge: ${response.statusText}`);
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    }

    // Return success message if no JSON response
    return { success: true, message: "Knowledge deleted successfully" };
  } catch (error) {
    console.error("Error in deleteKnowledge:", error);
    throw error;
  }
}
