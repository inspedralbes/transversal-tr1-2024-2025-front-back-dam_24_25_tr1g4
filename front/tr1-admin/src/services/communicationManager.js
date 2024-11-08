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
export async function postProductes(producte, imatge) {
  const formProducte= new FormData();
  console.log(producte);
  formProducte.append('nom', producte.nom);
  formProducte.append('preu',producte.preu);
  formProducte.append('estoc',producte.estoc);
  formProducte.append('imatge',imatge);
  formProducte.append('activat',producte.activat);

  const producto = await fetch(`${import.meta.env.VITE_API_ROUTE}/producte`, {
    method: 'POST',
    body : formProducte
  });
  if (!producto.ok) {
    const errorText = await producto.text();
    throw new Error(`Error al crear el producto: ${errorText}`);
  }


  const nuevo_producto = await producto.json();
  return nuevo_producto;
};