<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { getProductes } from '@/components/communicationmanager';
const productes = ref([]);

async function fetchGetProductes() {
  try {
    productes.value = await getProductes();
  }
  catch (error) {
    console.error('Error al obtener preguntas', error);
  }
};
onBeforeMount(() => {
  fetchGetProductes()
});
</script>

<template>
  <div>
    <h1>Productes</h1>
    <ul v-for="producte in productes">
      <li>{{ producte.id }}</li>
      <li><img :src="producte.imatge" alt="Imagen del producto"></li>
      <li>{{ producte.nom }}</li>
      <li>{{ producte.preu }}</li>
      <li>{{ producte.estoc }}</li>
    </ul>
  </div>
</template>

<style scoped>

</style>