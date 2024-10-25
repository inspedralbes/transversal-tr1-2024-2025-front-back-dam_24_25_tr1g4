// src/services/CommunicationManager.js

const URL = import.meta.env.VITE_API_ROUTE;

export async function getComandas() {
  try {
    const response = await fetch(`${URL}/comanda`);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error en Communication Manager:", error);
    throw error;
  }
}
export async function updateComanda(id, comanda) {
  const response = await fetch(`${URL}/comanda/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comanda),
  });
  const data = await response.json();
  return data;
}
