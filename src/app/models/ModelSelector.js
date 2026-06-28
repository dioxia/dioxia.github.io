/**
 *
 * src/app/models/modelSelector.js
 *
 */

import React from "react";

const ModelSelector = ({ models, selectedModel, setSelectedModel }) => {
  return (
    <select
      className="rounded bg-zinc-900 p-2"

      value={selectedModel}

      onChange={(e) => setSelectedModel(e.target.value)}
    >
      {models.map((model) => (
        <option key={model.name} value={model.name}>
          {model.name}
        </option>
      ))}
    </select>
  );
};

export default ModelSelector;
