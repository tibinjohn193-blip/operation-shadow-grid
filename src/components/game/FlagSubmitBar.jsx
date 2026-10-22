import { useState } from "react";

export default function FlagSubmitBar({ phase, onAction, onSubmitFlag }) {
  const [value, setValue] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    const ok = onSubmitFlag(value);
    if (ok) {
      setValue("");
      setShowError(false);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const hideFlagRow = phase.type === "narrative" || phase.autoAdvance;

  return (
    <div className="console-tray">
      <div id="dynamic-action-bar">
        {phase.actionLabel && (
          <button
            className="btn-shell-trigger"
            onClick={onAction}
            style={phase.type === "narrative" ? { color: "var(--accent-orange)", borderColor: "#5a1f28" } : undefined}
          >
            {phase.actionLabel}
          </button>
        )}
      </div>

      {!hideFlagRow && (
        <div className="input-row">
          <input
            type="text"
            id="flag-submit-field"
            className="console-input"
            placeholder="Submit flag or recon value..."
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button className="btn-submit" onClick={handleSubmit}>SUBMIT</button>
        </div>
      )}

      <div id="flag-feedback" className="error-badge" style={{ display: showError ? "block" : "none" }}>
        VERIFICATION FAILED: INCORRECT EVIDENCE SIGNATURE.
      </div>
    </div>
  );
}
