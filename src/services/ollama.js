/**
 *
 * src/services/ollama.js
 *
 */

const API = "http://localhost:11434";

export async function checkConnection() {
  try {
    const response = await fetch(`${API}/api/tags`);

    return response.ok;
  } catch {
    return false;
  }
}

export async function getModels() {
  const response = await fetch(`${API}/api/tags`);

  return await response.json();
}

export async function getVersion() {
  const response = await fetch(`${API}/api/version`);

  return await response.json();
}

export async function chat(model, messages) {
  const response = await fetch(`${API}/api/chat`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  return response.body.getReader();
}
