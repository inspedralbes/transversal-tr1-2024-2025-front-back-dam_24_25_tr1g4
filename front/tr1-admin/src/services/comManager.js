// src/services/CommunicationManager.js

const URL = process.env.VUE_APP_API_ROUTE; 

export default {
  async getComandas() {
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en Communication Manager:', error);
      throw error;
    }
  }
};
