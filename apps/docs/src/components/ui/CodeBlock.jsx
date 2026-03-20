"use client";

import { useState } from "react";

export function CodeBlock({ code, language = "jsx", filename }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900">
          <span className="text-sm text-neutral-400">{filename}</span>
          <button
            onClick={handleCopy}
            className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <div className="relative">
        {!filename && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors z-10"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
        <pre className="p-4 overflow-x-auto text-sm">
          <code className={`language-${language} text-neutral-300`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}

export function InstallCommand({ effect }) {
  const [copied, setCopied] = useState(false);
  const command = `npx hyperiux add ${effect}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
      <span className="text-green-500">$</span>
      <code className="flex-1 text-sm text-neutral-300">{command}</code>
      <button
        onClick={handleCopy}
        className="text-xs px-3 py-1.5 rounded bg-white text-black hover:bg-neutral-200 transition-colors font-medium"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
