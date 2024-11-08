<template>
  <v-app>
    <v-main >
      <router-view class="background"/>
    </v-main>
  </v-app>
</template>

<script setup>
  
</script>
<style scoped>
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