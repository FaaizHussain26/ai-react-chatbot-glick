export type ChatOption = {
  id: string;
  text: string;
  value: string;
};

interface InitialMessage {
  id: string;
  role: "assistant" | "data" | "system" | "user";
  content: string;
  options?: ChatOption[];
}

const dedent = (strings: TemplateStringsArray, ...values: string[]) => {
  const full = strings.reduce(
    (acc, str, i) => acc + (values[i - 1] || "") + str
  );
  const lines = full.split("\n");
  const minIndent = Math.min(
    ...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)?.[0].length ?? 0)
  );
  return lines
    .map((l) => l.slice(minIndent))
    .join("\n")
    .trim();
};

export const INITIAL_OPTIONS: ChatOption[] = [
  { id: "1", text: "PreSale Questions", value: "sale" },
  { id: "2", text: "Technical & Installation Help", value: "sizes" },
  { id: "3", text: "Order / Shipping Information ", value: "tools" },
];

export const INITIAL_MESSAGE: InitialMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: dedent`
What brings you to our site today?
`,
    options: INITIAL_OPTIONS,
  },
];

export const BUILD_MESSAGE: InitialMessage = {
  id: "build",
  role: "assistant",
  content: dedent`
    Great! You can build your own Murphy bed using our DIY hardware kit, which includes mechanical components—pivot plates, gas pistons, brackets, screws, and connectors—for fast, hassle‑free installation :contentReference[oaicite:5]{index=5}.

    You supply lumber and mattress (not included), and we provide full guides and support. Let me know if you'd like help choosing your size or orientation next.
  `,
};

export const SIZES_MESSAGE: InitialMessage = {
  id: "sizes",
  role: "assistant",
  content: dedent`
    We offer kits for:
    • **Twin** (fits 75″ × 39″ mattress, weight ~40–70 lb) :contentReference[oaicite:6]{index=6}  
    • **Full / Double** (fits 75″ × 54″ mattress, ~50–75 lb) :contentReference[oaicite:7]{index=7}  
    • **Queen** (fits 80″ × 60″ mattress, ~50–80 lb) :contentReference[oaicite:8]{index=8}  
    • **California King** also available for larger builds :contentReference[oaicite:9]{index=9}  

    Each size is available in **horizontal** (folds sideways, shallower stored profile) or **vertical** (folds up into the wall) orientation :contentReference[oaicite:10]{index=10}.

    Need help deciding which fits your room best?
  `,
};

export const TOOLS_MESSAGE: InitialMessage = {
  id: "tools",
  role: "assistant",
  content: dedent`
    You'll need basic woodworking tools like a table or circular saw, drill, clamps, a level, and common hand tools. Lumber and mattress are not included.

    Our kit includes printed and PDF guides with lumber cut-lists and step‑by‑step instructions. Video tutorials are also available to walk you through every size and orientation :contentReference[oaicite:11]{index=11}.
  `,
};

export const INSTALLATION_MESSAGE: InitialMessage = {
  id: "installation",
  role: "assistant",
  content: dedent`
    Installation involves constructing the bed cabinet, mounting the hardware, and installing the gas-piston mechanism. Guides include cut‑lists, pivot plate alignment, and safety steps :contentReference[oaicite:12]{index=12}.

    Our hardware kit is precision‑engineered for stability and ease of use, and we offer responsive support if you run into any issues.
  `,
};

export const SUPPORT_MESSAGE: InitialMessage = {
  id: "support",
  role: "assistant",
  content: dedent`
    All Easy DIY Murphy Bed hardware comes with a **lifetime warranty** on steel mechanisms and pistons, ensuring long-term reliability :contentReference[oaicite:13]{index=13}.

    We support you with documentation, video tutorials, and U.S.-based customer service for a smooth build experience.
  `,
};

export const GUIDES_MESSAGE: InitialMessage = {
  id: "guides",
  role: "assistant",
  content: dedent`
    We provide downloadable construction PDFs and online video walkthroughs for every size and orientation to guide you step‑by‑step :contentReference[oaicite:14]{index=14}.

    Would you like me to direct you to a specific PDF or video right now?
  `,
};

export const CONSULTATION_MESSAGE: InitialMessage = {
  id: "consultation",
  role: "assistant",
  content: dedent`
    If you're unsure which kit or orientation suits your space, I can help based on your room dimensions, skill level, and preferences—just let me know a little about your goals.
  `,
};
