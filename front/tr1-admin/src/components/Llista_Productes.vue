<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { getProductes } from '@/components/communicationmanager';
const productes = ref([]);

async function fetchGetProductes() {
  try {
    productes = await getProductes();
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
    <ul v-for="producte in productes.data">
      <li>{{ producte.id }}</li>
    </ul>
  </div>
</template>

<style scoped>

</style>