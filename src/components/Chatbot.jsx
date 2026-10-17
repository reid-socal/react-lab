import { useEffect, useRef, useState } from "react";

const money = (n) => `$${Number(n).toFixed(2)}`;

// A simple product-aware assistant. It reads the live product list and answers
// questions about price, origin, and specific coffees.
// To use a real LLM instead, replace this function with a fetch() call to your
// own backend endpoint that talks to an AI API (never put API keys in frontend code).
function getReply(input, products) {
  const text = input.toLowerCase().trim();

  if (products.length === 0) {
    return "I don't see any products yet. Add some in the Admin Portal and ask me again.";
  }

  if (/^(hi|hello|hey)\b/.test(text)) {
    return "Hi! I'm the Coffee R Us assistant. Ask me about our coffees, prices, or where they come from.";
  }

  if (text.includes("cheap") || text.includes("lowest") || text.includes("affordable")) {
    const cheapest = products.reduce((a, b) => (Number(a.price) <= Number(b.price) ? a : b));
    return `Our most affordable coffee is ${cheapest.name} from ${cheapest.origin} at ${money(cheapest.price)}.`;
  }

  if (text.includes("expensive") || text.includes("highest") || text.includes("premium")) {
    const priciest = products.reduce((a, b) => (Number(a.price) >= Number(b.price) ? a : b));
    return `Our premium pick is ${priciest.name} from ${priciest.origin} at ${money(priciest.price)}.`;
  }

  if (text.includes("how many")) {
    return `We currently carry ${products.length} coffee${products.length === 1 ? "" : "s"}.`;
  }

  // Specific product mentioned by name
  const byName = products.find((p) => text.includes(p.name.toLowerCase()));
  if (byName) {
    return `${byName.name} (${byName.origin}) costs ${money(byName.price)}. ${byName.description}`;
  }

  // Origin mentioned
  const byOrigin = products.filter((p) => text.includes(p.origin.toLowerCase()));
  if (byOrigin.length > 0) {
    const list = byOrigin.map((p) => `${p.name} (${money(p.price)})`).join(", ");
    return `From ${byOrigin[0].origin} we have: ${list}.`;
  }

  if (text.includes("origin") || text.includes("where") || text.includes("location")) {
    const origins = [...new Set(products.map((p) => p.origin))].join(", ");
    return `Our coffees come from: ${origins}.`;
  }

  if (text.includes("recommend") || text.includes("suggest")) {
    const pick = products[Math.floor(Math.random() * products.length)];
    return `Try ${pick.name} from ${pick.origin}: ${pick.description}`;
  }

  return "I can help with prices, origins, and recommendations. Try \"What's the cheapest coffee?\" or \"Do you have coffee from Kenya?\"";
}

export default function Chatbot({ products }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hi! Ask me about our coffees, prices, or origins." },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    if (open && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { id: Date.now(), from: "user", text: trimmed };
    const botMessage = { id: Date.now() + 1, from: "bot", text: getReply(trimmed, products) };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  }

  return (
    <div className="chatbot">
      {open && (
        <div className="chat-window" role="dialog" aria-label="Coffee assistant">
          <div className="chat-header">
            <span>Coffee Assistant</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </div>
          <div className="chat-messages" aria-live="polite">
            {messages.map((m) => (
              <p key={m.id} className={`chat-bubble ${m.from}`}>
                {m.text}
              </p>
            ))}
            <div ref={endRef} />
          </div>
          <form className="chat-form" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask about our coffee"
              aria-label="Message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
      <button type="button" className="chat-toggle" onClick={() => setOpen((o) => !o)}>
        {open ? "Close assistant" : "Ask the assistant"}
      </button>
    </div>
  );
}
