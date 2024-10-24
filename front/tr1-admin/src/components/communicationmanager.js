export async function getProductes() {
    let productes = await fetch(`${import.meta.env.VITE_API_ROUTE}/producte`)
    const llista_productes = await productes.json();
    console.log(llista_productes);
    return llista_productes
}