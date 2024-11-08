<template>
  <v-app>
    <v-main >
      
      <v-toolbar
      class="custom-toolbar"
      dark
      prominent
    >
      <v-toolbar-title class="titulo">WIRED</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn icon  @click="navegarAInici">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn class="mr-0.2"  @click="navegarAProductes">
        <v-icon class="mr-1">mdi-star-circle</v-icon>
        Productes
      </v-btn>
      <v-btn class="mr-1"  @click="navegarAComandes">
        <v-icon class="mr-1">mdi-cube</v-icon>
        Comandes
      </v-btn>
    </v-toolbar>
    <router-view class="background"/>
    </v-main>
  </v-app>
</template>

<script setup>
  import { useRouter } from 'vue-router';

const router = useRouter();
const navegarAInici = () => {
  router.push('/');
};
const navegarAProductes = () => {
  router.push('/gestioproductes');
};
const navegarAComandes = () => {
  router.push('/gestiocomandes');
};
</script>
<style scoped>
.custom-toolbar {
  background-color: #27527e; 
}
.titulo{
  font-weight: bold;
}
.background {
  background: linear-gradient(210deg, #86a8e7, #c2f7f4,#cfd5e1,#6c788e);
  background-size: 1000% 1000%;
  animation: gradient 10s ease infinite;
}
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>