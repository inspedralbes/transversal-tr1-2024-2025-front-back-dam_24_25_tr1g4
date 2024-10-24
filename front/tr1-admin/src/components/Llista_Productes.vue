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
  <v-container>
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-card>
            <v-card-title>
              <span class="text-h5">Productes</span>
            </v-card-title>
  
            <v-card-text>
              <v-list>
                <v-list-item v-for="producte in productes" :key="producte.id">
                  <v-list-item-content>
                    <v-list-item-title>
                      Producte #{{ producte.id }}
                    </v-list-item-title>
                    <v-list-item-title>
                      <img :src="producte.imatge" alt="Imagen del producto">
                    </v-list-item-title>
                    <v-list-item-group>
                      <v-list-item-title>
                      Nom: {{ producte.nom }}
                    </v-list-item-title>
                    <v-list-item-title>
                      Preu: {{ producte.preu }}
                    </v-list-item-title>
                    <v-list-item-title>
                      Estoc: {{ producte.estoc }}
                    </v-list-item-title>
                    </v-list-item-group>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<style scoped>

</style>