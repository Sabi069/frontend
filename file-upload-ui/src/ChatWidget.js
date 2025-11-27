// src/ChatWidget.js
import React from "react";

export default function ChatWidget({ isOpen, onToggle, children }) {
  return (
    <>
      {/* Floating button (when closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: "none",
            background: "#0b76ef",
            color: "white",
            fontSize: "28px",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          💬
        </button>
      )}

      {/* Chat window (when open) */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "380px",
            height: "520px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              padding: "12px",
              background: "#0b76ef",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "16px",
            }}
          >
            <strong>Chatbot</strong>
            <button
              onClick={onToggle}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          {/* Chat content goes here */}
          <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
        </div>
      )}
    </>
  );
}
