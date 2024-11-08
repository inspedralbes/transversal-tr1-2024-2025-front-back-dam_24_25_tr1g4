<template>
    <v-container class="container">
      <v-row justify="center">
        <v-col cols="auto">
          <h1>Administració Wired</h1>
        </v-col>
      </v-row>
      <img src="../assets/logo.jpg" alt="Logo Wired">
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn @click="navegarAProductes" density="default">Productes</v-btn>
        </v-col>
  
        <v-col cols="auto">
          <v-btn @click="navegarAComandes" density="default">Comandes</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
   import { useRouter } from 'vue-router';

   const router = useRouter(); 

   const navegarAProductes = () => {
    router.push('/gestioproductes');  
  };
  const navegarAComandes = () => {
    router.push('/gestiocomandes'); 
  };
  </script>
  
  <style>
    .container {
      height: 100%;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
    }

    .container>* {
      display: flex;

      align-items: center;
      justify-content: center;
    }

    .container > img{
      height: 500px;
      width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
  </style>
  