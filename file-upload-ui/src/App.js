// src/App.js
import React, { useState, useRef } from "react";
import ChatWidget from "./ChatWidget";

import "./index.css";

const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL || "http://localhost:8080/upload";
const QUERY_URL = process.env.REACT_APP_QUERY_URL || "http://localhost:8080/query";
const USE_MOCK = (process.env.REACT_APP_USE_MOCK || "true").toLowerCase() === "true";

function ChatMessage({ who, text }) {
  const isUser = who === "user";
  return (
    <div style={{ display: "flex", marginBottom: 8, justifyContent: isUser ? "flex-end" : "flex-start" }}>
      {!isUser && <div style={{ marginRight: 8, width: 36, textAlign: "center", color: "#0b76ef", fontWeight: "bold" }}>Bot</div>}
      <div style={{ maxWidth: "72%", padding: "10px 12px", borderRadius: 12, background: isUser ? "#0b76ef" : "#f3f4f6", color: isUser ? "#fff" : "#111" }}>
        <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
      </div>
      {isUser && <div style={{ marginLeft: 8, width: 36, textAlign: "center", color: "#333", fontWeight: "bold" }}>You</div>}
    </div>
  );
}

export default function App() {
  const [fileMeta, setFileMeta] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const fileRef = useRef(null);

  function pushMessage(who, text) {
    setMessages((m) => [...m, { who, text }]);
  }

  async function handleUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setFileMeta(null);

    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 700));
        const fake = { key: `mock-${Date.now()}`, url: URL.createObjectURL(f) };
        setFileMeta(fake);
        pushMessage("bot", `File "${f.name}" uploaded (mock).`);
      } else {
        const form = new FormData();
        form.append("file", f);
        const resp = await fetch(UPLOAD_URL, { method: "POST", body: form });
        if (!resp.ok) throw new Error("Upload failed");
        const json = await resp.json();
        setFileMeta({ key: json.key ?? json.filename ?? "filekey", url: json.url ?? null });
        pushMessage("bot", `File "${f.name}" uploaded.`);
      }
    } catch (err) {
      pushMessage("bot", `Upload error: ${err.message || err}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function askQuestion(question) {
    if (!question) return;
    if (!fileMeta && !USE_MOCK) {
      pushMessage("bot", "Please upload a file first.");
      return;
    }

    pushMessage("user", question);
    setLoadingAnswer(true);
    setInput("");

    try {
      // improved mock answers (replace the current mock block)
if (USE_MOCK) {
  await new Promise((r) => setTimeout(r, 700));
  const q = question.toLowerCase();
  if (q.includes("name")) pushMessage("bot", "Mock: The name found is John Doe.");
  else if (q.includes("date")) pushMessage("bot", "Mock: The document date is 2025-07-01.");
  else if (q.includes("total") || q.includes("amount") || q.includes("price")) pushMessage("bot", "Mock: Total amount found is ₹12,345.");
  else pushMessage("bot", `Mock (echo): I saw your question — "${question}". I can search for names, dates, totals, or summaries.`);
}
else {
        const payload = { question, fileKey: fileMeta.key };
        const resp = await fetch(QUERY_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!resp.ok) throw new Error("Query failed");
        const json = await resp.json();
        pushMessage("bot", json.answer ?? JSON.stringify(json));
      }
    } catch (err) {
      pushMessage("bot", `Error: ${err.message || err}`);
    } finally {
      setLoadingAnswer(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    askQuestion(q);
  }

  function clearChat() {
    setMessages([]);
  }

return (
  <div>
    {/* Upload area stays on page */}
    <div style={{ padding: "20px" }}>
      <h2>Upload File</h2>
      <input type="file" onChange={handleUpload} />
      <p>Status: {uploading ? "Uploading..." : fileMeta ? "Uploaded" : "No file"}</p>
    </div>

    {/* Floating Chat Widget */}
    <ChatWidget isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
      {/* Your full chat UI */}
      <div style={{ padding: "12px" }}>
        <h4>Chat about file</h4>

        <div style={{ height: "350px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "8px", padding: "10px" }}>
          {messages.map((m, i) => (
            <ChatMessage key={i} who={m.who} text={m.text} />
          ))}
        </div>

        <form onSubmit={onSubmitChat} style={{ marginTop: "12px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            style={{ width: "75%", padding: "8px" }}
          />
          <button style={{ padding: "8px 12px", marginLeft: "8px" }}>Ask</button>
        </form>
      </div>
    </ChatWidget>
  </div>
)
}