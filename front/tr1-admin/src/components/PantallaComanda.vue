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
                <!-- <div class="tabla_item">{{ comanda.productes }}</div> -->
                <div class="tabla_item">
                  <v-dialog v-model="dialog" max-width="500">
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn
                        v-bind="activatorProps"
                        color="surface-variant"
                        text="Editar"
                        variant="flat"
                        @click="openEditDialog(comanda)"
                      ></v-btn>
                    </template>

                    <template v-slot:default>
                      <v-card title="Edició de comanda">
                        <v-card-text>
                          <v-text-field
                            label="ID User"
                            v-model="editableComanda.idUser"
                          ></v-text-field>
                          <v-text-field
                            label="Estat"
                            v-model="editableComanda.estat"
                          ></v-text-field>
                          <v-text-field
                            label="Preu Total"
                            v-model="editableComanda.preu_total"
                            type="number"
                          ></v-text-field>
                          <v-textarea
                            label="Productes"
                            v-model="editableComanda.productes"
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
<script>
import { ref, onMounted } from "vue";
import CommunicationManager from "@/services/communicationManager";

export default {
  setup() {
    const comandas = ref([]);
    const dialog = ref(false); 
    const editableComanda = ref({}); 

    const fetchComandas = async () => {
      try {
        const data = await CommunicationManager.getComandas();
        comandas.value = data;
      } catch (error) {
        console.error("Error al obtener las comandas:", error);
      }
    };

    const openEditDialog = (comanda) => {
      editableComanda.value = { ...comanda }; 
      dialog.value = true;
    };

    const saveEdit = async () => {
      try {
        const updatedComanda = {
          idUser: editableComanda.value.idUser,
          productes: editableComanda.value.productes,
          estat: editableComanda.value.estat,
          preu_total: editableComanda.value.preu_total,
        };
        await CommunicationManager.updateComanda(editableComanda.value.id, updatedComanda);
        const index = comandas.value.findIndex((c) => c.id === editableComanda.value.id);
        comandas.value[index] = { ...editableComanda.value };
        dialog.value = false;
      } catch (error) {
        console.error("Error al actualizar la comanda:", error);
      }
    };

    onMounted(() => {
      fetchComandas();
    });

    return {
      comandas,
      dialog,
      editableComanda,
      openEditDialog,
      saveEdit,
    };
  },
};
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
.text-h5 {
  font-weight: bold;
}
</style>
