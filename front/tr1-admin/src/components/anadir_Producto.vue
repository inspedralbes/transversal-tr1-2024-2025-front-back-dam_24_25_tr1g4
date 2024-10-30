<script setup>
import { reactive, ref } from 'vue'
import { postProductes } from '@/services/communicationManager';
    const añadir = ref(false);
    function aparecer_añadir() {
        añadir.value = !añadir.value
    };
    const nom = ref('');
    const img = ref('');
    const preu = ref(0);
    const estoc = ref(0);
    const activat = ref(0)

    async function fetchPostProductes() {
        try {
            const nouproducte = await postProductes({
                nom : nom.value,
                preu : preu.value,
                estoc : estoc.value,
                img : img.value,
                activat : activat.value,
        });
        console.log('Producto creado:', nouproducte);
        nom.value = '';
        preu.value = '';
        estoc.value = '';
        img.value = '';
        activat.value = '';
        añadir.value = false;
        } catch (error) {
            console.error('Error al enviar el producto;', error);
        }         
    };

</script>

<template>
    <!-- <v-btn @click="aparecer_añadir">
        Añadir Producte
    </v-btn> -->
    <div v-if="añadir">
    <v-card>
        <v-card-title>
            <span class="Titulo">Añadir Pregunta</span>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                        <v-text-field v-model="nom" label="Nom*" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <v-text-field v-model="img" label="Imatge*" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <v-text-field v-model="preu" label="Preu*" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <v-text-field v-model="estoc" label="Estoc*" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                        <v-text-field v-model="activat" label="Activat*" required></v-text-field>
                    </v-flex>
                    <v-btn color="blue darken-1" flat @click="añadir='false'">Cerrar</v-btn>
            <v-btn color="blue darken-1" flat @click="fetchPostProductes">Añadir</v-btn>
                </v-layout>
            </v-container>
        </v-card-text>
    </v-card>
    </div>
</template>

<style scoped>
</style>