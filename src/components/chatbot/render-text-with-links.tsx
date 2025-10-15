export const renderTextWithLinks = (text: string, isUserMessage = false) => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const phoneRegex =
    /($$\d{3}$$[-.\s]?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]\d{3}[-.\s]?\d{4})/g;

  // Split text by URLs and phone numbers while keeping the matches
  const parts = text.split(
    /(https?:\/\/[^\s]+|www\.[^\s]+|$$\d{3}$$[-.\s]?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]\d{3}[-.\s]?\d{4})/gi
  );

  return parts.map((part, index) => {
    // Check if it's a URL
    if (urlRegex.test(part)) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline hover:no-underline ${
            isUserMessage
              ? "text-white hover:text-gray-200"
              : "text-blue-600 hover:text-blue-800"
          }`}
        >
          {part}
        </a>
      );
    }

    // Check if it's a phone number
    if (phoneRegex.test(part)) {
      // Clean phone number for tel: link
      const cleanPhone = part.replace(/[^\d]/g, "");
      return (
        <a
          key={index}
          href={`tel:${cleanPhone}`}
          className={`underline hover:no-underline ${
            isUserMessage
              ? "text-white hover:text-gray-200"
              : "text-blue-600 hover:text-blue-800"
          }`}
        >
          {part}
        </a>
      );
    }

    // Return regular text
    return part;
  });
};
