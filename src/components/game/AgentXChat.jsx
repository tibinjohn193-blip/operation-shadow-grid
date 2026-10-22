export default function AgentXChat({ chatId, messages, variant = "console" }) {
  const paneClass = variant === "terminal" ? "terminal-agent-pane" : "console-agent-pane";
  return (
    <div className={paneClass}>
      <div className="term-agent-header">
        <span>COMM LINK: AGENT X</span>
        <span style={{ color: "#00e599" }}>● LIVE</span>
      </div>
      <div className="term-agent-chat" id={chatId}>
        {messages.map((msg, i) => (
          <div className="term-agent-msg" key={i} dangerouslySetInnerHTML={{ __html: `<b>Agent X:</b> ${msg}` }} />
        ))}
      </div>
    </div>
  );
}
