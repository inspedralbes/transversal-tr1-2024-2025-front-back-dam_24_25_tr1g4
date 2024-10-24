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
          <v-card-title>
            <span class="text-h5">Comandes</span>
          </v-card-title>

          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>ID</th>
                  <th>Estat</th>
                  <th>ID User</th>
                  <th>Preu Total</th>
                  <th>Productes</th>
                  <th>º º</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="comanda in comandas" :key="comanda.id">
                  <td>
                    <v-img :src="comanda.imagen" max-width="100" />
                  </td>
                  <td>{{ comanda.id }}</td>
                  <td>{{ comanda.estat }}</td>
                  <td>{{ comanda.iduser }}</td>
                  <td>{{ comanda.preu_total }}</td>
                  <td>{{ comanda.productes }}</td>
                  <td>
                    <v-btn color="black" @click="editComanda(comanda.id)">
                      Editar
                    </v-btn>
                    <v-btn color="grey" @click="deleteComanda(comanda.id)">
                      Eliminar
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ref, onMounted } from 'vue';
import CommunicationManager from "@/services/communicationManager"; 

export default {
  setup() {
    const comandas = ref([]);

    const fetchComandas = async () => {
      try {
        const data = await CommunicationManager.getComandas(); 
        comandas.value = data;
      } catch (error) {
        console.error("Error al obtener las comandas:", error);
      }
    };

    const editComanda = (id) => {
      console.log("Editando comanda con ID:", id);
    };

    const deleteComanda = (id) => {
      console.log("Eliminando comanda con ID:", id);
    };

    onMounted(() => {
      fetchComandas();
    });

    return {
      comandas,
      editComanda,
      deleteComanda
    };
  }
};
</script>

<style scoped>
.exit-btn {
  margin-left: 0;
  position: top left;
  top: 10px;
  left: 10px;
}

.v-table {
  width: 100%;
  border-collapse: collapse;
}

.v-table th,
.v-table td {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  text-align: left;
}

.v-table th {
  background-color: #f5f5f5;
}

.text-h5 {
  font-weight: bold;
}
</style>
