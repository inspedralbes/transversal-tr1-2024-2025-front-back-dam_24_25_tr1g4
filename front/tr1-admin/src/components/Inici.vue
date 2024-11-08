<template>
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="auto">
        <h1>Administració Wired</h1>
      </v-col>
    </v-row>
    <img src="../assets/logo.jpg" alt="Logo Wired" />
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn
          @click="navegarAProductes"
          density="default"
          elevation="8"
          rounded="xl"
          size="x-large"
          color="normal"
        >
          Productes
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          @click="navegarAComandes"
          density="default"
          elevation="8"
          rounded="xl"
          size="x-large"
          color="normal"
        >
          Comandes
        </v-btn>
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

<style scoped>
.container {
  height: 100vh;
  /* width: 100vw; */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  /* background: linear-gradient(210deg, #86a8e7, #c2f7f4,#cfd5e1,#6c788e);
  background-size: 1000% 1000%;
  animation: gradient 10s ease infinite; */
}

.container > * {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container > img {
  height: 500px;
  width: 500px;
  margin: 0 auto;
}

/* @keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
} */
</style>
