<script setup>
import { onBeforeMount, reactive, ref } from "vue";
import { getProductes, deleteProducte } from "@/services/communicationManager";
import EditarProducte from "./EditarProducte.vue";
import Anadir_Producto from "./anadir_Producto.vue";
import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_ROUTE;

const socket = io(URL);


const productes = ref([]);
const dialog = ref(false);
const addDialog = ref(false);
const producteSeleccionat = reactive({
  producte: null,
});
const imgBaseURL = ref(import.meta.env.VITE_API_ROUTE + `/assets/`);

async function fetchGetProductes() {
  try {
    productes.value = await getProductes();
  } catch (error) {
    console.error("Error al obtener preguntas", error);
  }
}

async function handleDeleteProduct(producteId) {
  try {
    await deleteProducte(producteId);
    productes.value = productes.value.filter(
      (producte) => producte.id !== producteId
    );
  } catch (error) {
    console.error("Error al borrar producto", error);
  }
}
function openEditDialog(producte) {
  producteSeleccionat.producte = { ...producte };
  dialog.value = true;
}

function openCreateDialog() {
  addDialog.value = true;
}

function cerrarDialogo() {
  dialog.value = false;
  addDialog.value = false;
  producteSeleccionat.producte = null;
}

async function guardarCambios(updatedProducte) {
  const index = productes.value.findIndex((p) => p.id === updatedProducte.id);
  if (index !== -1) {
    productes.value[index] = updatedProducte;
  } else {
    productes.value.push(updatedProducte)
  }
}

onBeforeMount(() => {
  fetchGetProductes();
  // socket.on("producteUpdated", (updatedProducte) => {
  //   const index = productes.value.findIndex((c) => c.id === updatedProducte.id);
  //   if (index !== -1) {
  //     productes.value[index].estat = updatedComanda.estat;
  //   }
  // });
  socket.on("actualizarProductes", (productosActualizados) => {
    console.log(productosActualizados);
    productes.value = productosActualizados;
  });
});

</script>

<template>
  <v-container class="mb-5">
    <v-row class="flex flex-col justify-center ma-5 ">
      <Anadir_Producto />
      <v-btn @click="openCreateDialog(producte)">Afegir Producte</v-btn>
    </v-row>

    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-card class="borde-tabla">
          <v-card-text>
            <div class="container-tabla">
              <div class="tabla-titulo pt-3 pb-3">PRODUCTES</div>
              <div class="tabla_apartados">ID</div>
              <div class="tabla_apartados">NOM</div>
              <div class="tabla_apartados">IMG</div>
              <div class="tabla_apartados">PREU</div>
              <div class="tabla_apartados">ESTOC</div>
              <div class="tabla_apartados">ACTIVAT</div>
              <div class="tabla_apartados">ACTIONS</div>

              <div
                v-for="producte in productes"
                :key="producte.id"
                class="tabla_row"
              >
                <div class="tabla_item">{{ producte.id }}</div>
                <div class="tabla_item">{{ producte.nom }}</div>
                <div class="tabla_item tabla_img">
                  <img
                    :src="imgBaseURL + producte.imatge"
                    alt="Imatge de producte"
                  />
                </div>
                <div class="tabla_item">{{ producte.preu }}</div>
                <div class="tabla_item">{{ producte.estoc }}</div>
                <div class="tabla_item">{{ producte.activat?"yes":"no" }}</div>

                <div class="tabla_item tabla_btns">
                  
                  <v-btn @click="openEditDialog(producte)">Editar</v-btn>
                 
                  <v-dialog max-width="500">
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn
                        v-bind="activatorProps"
                        color="surface-variant"
                        text="ELIMINAR"
                        variant="flat"
                      ></v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                      <v-card title="Confirmar acció">
                        <v-card-text>
                          Estàs segur/a que vols eliminar aquest producte?
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer></v-spacer>

                          <v-btn
                            text="Tancar"
                            @click="isActive.value = false"
                          ></v-btn>
                          <v-btn
                            text="Eliminar"
                            @click="handleDeleteProduct(producte.id)"
                          ></v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
        <EditarProducte
          v-model="dialog"
          :producte="producteSeleccionat.producte"
          @cerrar="cerrarDialogo"
          @guardar="guardarCambios"
        />
        <AfegirProducte
          v-model="addDialog"
          :producte="producteSeleccionat.producte"
          @cerrar="cerrarDialogo"
          @guardar="guardarCambios"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.borde-tabla {
  box-shadow: 5px 5px 10px #333;
}

.container-tabla {
  width: 100%;
  /* background-color: whitesmoke; */
  /* margin: auto; */
  /* box-shadow: 5px 5px 10px #333; */
  gap: 20px;

  display: grid;
  grid-template-columns: 1fr 3fr 1.6fr 1fr 1fr 1fr 3fr;
}
.tabla_row {
  display: contents;
}
.tabla-titulo {
  grid-column-start: 1;
  grid-column-end: 8;

  background-color: #ebebeb;
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
.tabla_item {
  padding: 10px 5px;
  font-size: 1.2em;
}

.tabla_img {
  overflow: hidden;
}

.tabla_img img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.tabla_btns > * {
  margin: 10px;
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
