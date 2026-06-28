/**
 *
 * src/app/card/Card.js
 *
 */

import React from "react";

import useOllama from "../../hooks/useOllama";
import StatusBadge from "../status/StatusBadge";
import ModelSelector from "../models/ModelSelector";

const Card = () => {
  const { connected, models, selectedModel, setSelectedModel } = useOllama();

  return (
    <div
      className="
      w-full
      max-w-5xl
      rounded-xl
      bg-zinc-950
      border
      border-zinc-700
      shadow-2xl
      "
    >
      <div className="flex justify-between p-4 border-b border-zinc-700 text-gray-500">
        <h1 className="text-xl font-bold text-gray-500">Ollama Chat</h1>

        <StatusBadge connected={connected} />
      </div>

      <div className="p-4">
        <ModelSelector
          models={models}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
      </div>

      <div className="h-96 border-t border-zinc-700 p-4 text-gray-500">
        Chat history goes here...
      </div>

      <div className="border-t border-zinc-700 p-4 text-gray-500">Input box goes here...</div>
    </div>
  );
};

export default Card;

