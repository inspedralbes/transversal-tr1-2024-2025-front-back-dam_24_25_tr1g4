<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { getProductes } from '@/services/communicationManager';
const productes = ref([]);
const producto = ref(false);

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
    <v-row justify="start">
      <v-col cols="12" md="2">
        <v-btn color="black" class="exit-btn" @click="handleExit">
          <v-icon left>mdi-exit-to-app</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-card>
          <v-card-text>
            <div class="container-tabla">
              <div class="tabla-titulo">Productes</div>
              <div class="tabla_apartados">ID</div>
              <div class="tabla_apartados">NOM</div>
              <div class="tabla_apartados"></div>
              <div class="tabla_apartados">PREU</div>
              <div class="tabla_apartados">ESTOC</div>


              <div
                v-for="producte in productes"
                :key="producte.id"
                class="tabla_row"
              >
                <div class="tabla_item">{{ producte.id }}</div>
                <div class="tabla_item">{{ producte.nom }}</div>
                <div class="tabla_item"><img :src="producte.imatge" alt="Imatge de producte"></div>
                <div class="tabla_item">{{ producte.preu }}</div>
                <div class="tabla_item">{{ producte.estoc }}</div>
                <!-- <div class="tabla_item">{{ comanda.productes }}</div> -->
                <div class="tabla_item">
                  <v-dialog v-model="dialog" max-width="500">
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn
                        v-bind="activatorProps"
                        color="surface-variant"
                        text="Editar"
                        variant="flat"
                        @click="openEditDialog(producto)"
                      ></v-btn>
                    </template>

                    <template v-slot:default>
                      <v-card title="Edició de producte">
                        <v-card-text>
                          <v-text-field
                            label="Nom"
                            v-model="editableProducte.nom"
                          ></v-text-field>
                          <v-text-field
                            label="Imagen"
                            v-model="editableProducte.imatge"
                          ></v-text-field>
                          <v-textarea
                            label="Preu"
                            v-model="editableProducte.preu"
                            type="number"
                          ></v-textarea>
                          <v-textarea
                            label="Estoc"
                            v-model="editableProducte.estoc"
                            type="number"
                          ></v-textarea>
                        </v-card-text>
                       <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn text="Cancel" @click="dialog = false"></v-btn>
                          <v-btn color="primary" text="Save" @click="saveEdit"></v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .container-tabla {
  width: 100%;
  background-color: whitesmoke;
  margin: auto;
  box-shadow: 0 0 20px #333;
  gap: 1px;

  display: grid;
  grid-template-columns: 20% 20% 30% 15%;
  grid-auto-rows: 50px;
}
.tabla_row {
  display: contents;
}
.tabla-titulo {
  grid-column-start: 1;
  grid-column-end: 7;

  background-color: #e0e0e0;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.7em;
}
.tabla_apartados,
.tabla_item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.tabla_apartados {
  font-weight: bold;
  font-size: 1.5em;
}
.tabla_apartados {
  font-weight: bold;
  font-size: 1.5em;
}
.tabla_item {
  padding: 10px 5px;
  font-size: 1.2em;
}
.exit-btn {
  margin-left: 0;
  position: top left;
  top: 10px;
  left: 10px;
}
v-card-text {
  color: black;
}
</style>