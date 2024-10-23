<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-card>
            <v-card-title>
              <span class="text-h5">Comandas</span>
            </v-card-title>
  
            <v-card-text>
              <v-list>
                <v-list-item v-for="comanda in comandas" :key="comanda.id">
                  <v-list-item-content>
                    <v-list-item-title>
                      Comanda #{{ comanda.id }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Productes:
                    </v-list-item-subtitle>
                    <v-list-item-group>
                      <v-list-item v-for="producto in comanda.productes" :key="producto.idProducte">
                        <v-list-item-content>
                          <v-list-item-title>
                            Producte: {{ producto.idProducte }} - Quantitat: {{ producto.quantitat }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            Preu: {{ producto.preu.toFixed(2) }} €
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
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
  
  <script>
  import CommunicationManager from "@/services/comManager"; 
  
  export default {
    data() {
      return {
        comandas: [] 
      };
    },
    methods: {
      async fetchComandas() {
        try {
          const data = await CommunicationManager.getComandas(); 
          this.comandas = data;
        } catch (error) {
          console.error("Error al obtener las comandas:", error);
        }
      }
    },
    mounted() {
      this.fetchComandas();
      console.log(import.meta.env.VITE_API_ROUTE);
    }
  };
  </script>
  
  <style scoped>
  </style>
  