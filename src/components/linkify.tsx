import React from "react";

interface LinkifyTextProps {
  text: string;
}

export const LinkifyText: React.FC<LinkifyTextProps> = ({ text }) => {
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const simpleUrlRegex = /(https?:\/\/[^\s[\]()]+)/g;

  const renderText = (textSegment: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const combinedRegex = /(\*\*([^*]+)\*\*|~~([^~]+)~~|\$[\d,]+(?:\.\d{2})?)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = combinedRegex.exec(textSegment)) !== null) {
      const matchStart = match.index;
      const matchEnd = combinedRegex.lastIndex;

      if (lastIndex < matchStart) {
        parts.push(textSegment.slice(lastIndex, matchStart));
      }

      const fullMatch = match[0];

      if (fullMatch.startsWith("**") && fullMatch.endsWith("**")) {
        parts.push(
          <strong key={`bold-${matchStart}`}>{fullMatch.slice(2, -2)}</strong>
        );
      } else if (fullMatch.startsWith("~~") && fullMatch.endsWith("~~")) {
        parts.push(
          <del key={`strike-${matchStart}`} className="text-gray-500">
            {fullMatch.slice(2, -2)}
          </del>
        );
      } else if (fullMatch.startsWith("$") || fullMatch.includes("US $")) {
        parts.push(
          <strong key={`price-${matchStart}`} className="text-green-400">
            {fullMatch}
          </strong>
        );
      }

      lastIndex = matchEnd;
    }

    if (lastIndex < textSegment.length) {
      parts.push(textSegment.slice(lastIndex));
    }

    return parts;
  };

  const renderLine = (line: string, index: number): React.ReactNode => {
    if (line.startsWith("- ")) {
      const item = line.substring(2);
      return (
        <li key={`li-${index}`} className="ml-4 list-disc">
          {renderText(item)}
        </li>
      );
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = markdownLinkRegex.exec(line)) !== null) {
      const [fullMatch, label, url] = match;
      const matchStart = match.index;
      const matchEnd = matchStart + fullMatch.length;

      if (lastIndex < matchStart) {
        const plainText = line.slice(lastIndex, matchStart);
        const plainParts = plainText.split(simpleUrlRegex).map((part, i) =>
          simpleUrlRegex.test(part) ? (
            <a
              key={`url-${matchStart}-${i}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-black underline break-all"
            >
              {part}
            </a>
          ) : (
            renderText(part)
          )
        );
        parts.push(...plainParts);
      }

      parts.push(
        <a
          key={`md-link-${matchStart}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-black underline break-all"
        >
          {label}
        </a>
      );

      lastIndex = matchEnd;
    }

    if (lastIndex < line.length) {
      const remaining = line.slice(lastIndex);
      const remainingParts = remaining.split(simpleUrlRegex).map((part, i) =>
        simpleUrlRegex.test(part) ? (
          <a
            key={`url-end-${lastIndex}-${i}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-black underline break-all"
          >
            {part}
          </a>
        ) : (
          renderText(part)
        )
      );
      parts.push(...remainingParts);
    }

    return <p key={`p-${index}`}>{parts}</p>;
  };

  const lines = text.split(/\n+/);
  const bulletLines = lines.filter(
    (line) => line.startsWith("- ") && !line.startsWith("- Link:")
  );
  const nonBulletLines = lines.filter(
    (line) => !line.startsWith("- ") && !line.startsWith("- Link:")
  );

  return (
    <>
      {nonBulletLines.map((line, index) => renderLine(line, index))}
      {bulletLines.length > 0 && (
        <ul className="mt-2">{bulletLines.map(renderLine)}</ul>
      )}
    </>
  );
};
