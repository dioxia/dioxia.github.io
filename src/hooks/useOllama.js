/**
 *
 * src/hooks/useOllama.js
 * 
 */

import { useEffect, useState } from "react";

import { checkConnection, getModels } from "../services/ollama";

export default function useOllama() {
  const [connected, setConnected] = useState(false);

  const [models, setModels] = useState([]);

  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    async function load() {
      const online = await checkConnection();

      setConnected(online);

      if (online) {
        const list = await getModels();

        setModels(list.models);

        if (list.models.length) {
          setSelectedModel(list.models[0].name);
        }
      }
    }

    load();
  }, []);

  return {
    connected,
    models,
    selectedModel,
    setSelectedModel,
  };
}
