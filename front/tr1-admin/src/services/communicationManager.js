// src/services/CommunicationManager.js

const URL = import.meta.env.VITE_API_ROUTE; 

export default {
  async getComandas() {
    try {
      const response = await fetch(`${URL}/comanda`);
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      
      return data;
    } catch (error) {
      console.error('Error en Communication Manager:', error);
      throw error;
    }
  }
};
export async function getProductes() {
  let productes = await fetch(`${import.meta.env.VITE_API_ROUTE}/producte`)
  const llista_productes = await productes.json();
  console.log(llista_productes);
  return llista_productes
}

