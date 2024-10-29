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
export async function postProductes({nom, img, preu, estoc, activat}) {
  const formProducte = new URLSearchParams();
  formProducte.append('nom', nom);
  formProducte.append('preu',preu);
  formProducte.append('estoc',estoc);
  formProducte.append('img',img);
  formProducte.append('activat',activat);

  const producto = await fetch(`${import.meta.env.VITE_API_ROUTE}/producte`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body : formProducte.toString()
  });

  const nuevo_producto = await producto.json();
  return nuevo_producto;
};