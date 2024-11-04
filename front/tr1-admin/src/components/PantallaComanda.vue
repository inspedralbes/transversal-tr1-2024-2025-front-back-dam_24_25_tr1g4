<template>
  <v-container>

    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-card>
          <v-card-text>
            <div class="container-tabla">
              <div class="tabla-titulo">Comandes</div>
              <div class="tabla_apartados">ID</div>
              <div class="tabla_apartados">Estat</div>
              <div class="tabla_apartados">ID User</div>
              <div class="tabla_apartados">Preu Total</div>
              <div class="tabla_apartados"></div>

              <div
                v-for="comanda in comandas"
                :key="comanda.id"
                class="tabla_row"
              >
                <div class="tabla_item">{{ comanda.id }}</div>
                <div class="tabla_item">{{ comanda.estat==0?"Rebuda":comanda.estat==1?"En preparació":comanda.estat==2?"Preparada":"Recollida" }}</div>
                <div class="tabla_item">{{ comanda.iduser }}</div>
                <div class="tabla_item">{{ comanda.preu_total }}€</div>
                <div class="tabla_item">
                  <v-btn color="surface-variant" text @click="Edicio(comanda)">Canviar estat</v-btn>
                </div>
              </div>
            </div>
            <EdicioComanda
              v-model="dialog"
              :comanda="comandaSeleccionada"
              @cerrar="cerrarDialogo"
              @guardar="guardarCambios"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getComandas } from "@/services/communicationManager";
import EdicioComanda from "@/components/EdicioComanda.vue";

const comandas = ref([]);
const dialog = ref(false);
const comandaSeleccionada = ref(null);

const fetchComandas = async () => {
  try {
    const data = await getComandas();
    comandas.value = data;
  } catch (error) {
    console.error("Error al obtener las comandas:", error);
  }
};

const Edicio = (comanda) => {
  comandaSeleccionada.value = { ...comanda }; 
  dialog.value = true;  
};

const cerrarDialogo = () => {
  dialog.value = false;
  comandaSeleccionada.value = null;
};

const guardarCambios = (updatedComanda) => {
  const index = comandas.value.findIndex((c) => c.id === updatedComanda.id);
  if (index !== -1) {
    comandas.value[index].estat = updatedComanda.estat;
  }
  cerrarDialogo();
};

onMounted(() => {
  fetchComandas();
});
</script>

<style scoped>
.container-tabla {
  width: 100%;
  background-color: whitesmoke;
  margin: auto;
  box-shadow: 0 0 20px #333;
  gap: 1px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1.5fr;
  grid-auto-rows: 50px;           
}
.tabla_row {
  display: contents;
}
.tabla-titulo {
  grid-column-start: 1;
  grid-column-end: 6;

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

</style>
