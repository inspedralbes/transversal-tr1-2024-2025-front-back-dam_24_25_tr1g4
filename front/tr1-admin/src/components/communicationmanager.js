export async function getProductes() {
    let productes = await fetch(`${import.meta.env.VITE_API_ROUTE}/pregunta`)
    productes = await productes.json();
    return productes
}