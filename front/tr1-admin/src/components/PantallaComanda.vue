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
                <div class="tabla_item">{{ comanda.estat }}</div>
                <div class="tabla_item">{{ comanda.iduser }}</div>
                <div class="tabla_item">{{ comanda.preu_total }}</div>
                <div class="tabla_item">
                  <v-btn color="surface-variant" text @click="Edicio(comanda)"
                    >Editar</v-btn
                  >
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
import { io } from "socket.io-client";

// import { socket } from "@/services/socket";
const comandas = ref([]);
const dialog = ref(false);
const comandaSeleccionada = ref(null);

const URL = import.meta.env.VITE_API_ROUTE;

const socket = io(URL);

socket.on("connect", () => {
    console.log("connected");
});

socket.on("conected", (msg) => {
  console.log(msg);
})

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
  socket.on("comandaUpdated", (updatedComanda) => {
    const index = comandas.value.findIndex((c) => c.id === updatedComanda.id);
    if (index !== -1) {
      comandas.value[index].estat = updatedComanda.estat;
    }
  });

  socket.on("actualizarArrayComandes", (comandasActualizadas) => {
    console.log("Actualitzant comandes");
    comandas.value = comandasActualizadas;
  });
});

onUnmounted(() => {
  socket.disconnect();
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
  grid-template-columns: 20% 20% 30% 15%;
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
