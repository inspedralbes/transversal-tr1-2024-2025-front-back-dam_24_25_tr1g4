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
export const deleteProducte = async (id) =>{
  const response = await fetch(`${URL}/producte/${id}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  const data = await response.json()
  return data;
}

export const updateProducte = async (producte) =>{
  console.log(producte);
  const response = await fetch(`${URL}/producte/${producte.id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(producte)
  })
  const data = await response.json()
  return data;
}
export async function postProductes({nom, imatge, preu, estoc, activat}) {
  const formProducte = new URLSearchParams();
  formProducte.append('nom', nom);
  formProducte.append('preu',preu);
  formProducte.append('estoc',estoc);
  formProducte.append('imatge',imatge);
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