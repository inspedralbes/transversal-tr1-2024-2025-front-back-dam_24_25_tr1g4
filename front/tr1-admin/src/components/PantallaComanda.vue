<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-card>
            <v-card-title>
              <span class="text-h5">Comandes</span>
            </v-card-title>
  
            <v-card-text>
              <v-list>
                <v-list-item v-for="comanda in comandas" :key="comanda.id">
                  <v-list-item-content>
                    <v-list-item-title>
                      Comanda #{{ comanda.id }}
                    </v-list-item-title>
                    <v-list-item-group>
                      <v-list-item-title>
                      Estat {{ comanda.estat }}
                    </v-list-item-title>
                    <v-list-item-title>
                      Id {{ comanda.id }}
                    </v-list-item-title>
                    <v-list-item-title>
                      IdUser {{ comanda.idUser }}
                    </v-list-item-title>
                    <v-list-item-title>
                      Preu total {{ comanda.preu_total }}
                    </v-list-item-title>
                    <v-list-item-title>
                      Productes {{ comanda.productes }}
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
  <script>
  import {ref, onMounted} from 'vue';
  import CommunicationManager from "@/services/communicationManager"; 
  
  export default {
    setup() {
      const comandas = ref ([]);
  
      const fetchComandas = async() => {
        try {
          const data = await CommunicationManager.getComandas(); 
          comandas.value = data;
        } catch (error) {
          console.error("Error al obtener las comandas:", error);
        }
      };
    onMounted(() => {
      fetchComandas();
      console.log(import.meta.env.VITE_API_ROUTE);
    });

     return {
      comandas
    };
  }
  };
  </script>
  
  <style scoped>
  </style>
  