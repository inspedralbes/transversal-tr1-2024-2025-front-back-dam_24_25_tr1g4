<template>
  <v-dialog v-model="isDialogOpen" max-width="500">
    <v-card>
      <v-card-title>Edició comanda</v-card-title>
      <v-card-text>
        <v-text-field
          label="ID"
          v-model="comandaEditable.id"
          disabled
        ></v-text-field>
        <v-text-field
          label="ID User"
          v-model="comandaEditable.iduser"
          disabled
        ></v-text-field>
        <v-text-field
          label="Preu Total"
          v-model="comandaEditable.preu_total"
          type="number"
          disabled
        ></v-text-field>
        <v-text-field
          label="Productes"
          v-model="comandaEditable.productes"
          disabled
        ></v-text-field>
        <v-text-field
          label="Estat"
          v-model="comandaEditable.estat"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="cerrarDialogo">Cancelar</v-btn>
        <v-btn color="primary" text @click="guardarCambios">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import { updateComanda } from "@/services/communicationManager";

const props = defineProps({
  comanda: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "cerrar", "guardar"]);

const comandaEditable = ref({ ...props.comanda });
const isDialogOpen = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  isDialogOpen.value = newValue;
  if (newValue) {
    comandaEditable.value = { ...props.comanda }; 
  }
});

const guardarCambios = async () => {
  try {
    console.log("Comanda a actualizar:", comandaEditable.value); 
    const updatedComanda = await updateComanda(comandaEditable.value.id, {
      estat: comandaEditable.value.estat,
    });
    emit("guardar", updatedComanda);
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar los cambios:", error);
  }
};

const cerrarDialogo = () => {
  emit("update:modelValue", false);
  isDialogOpen.value = false;
  emit("cerrar");
};

watch(
  () => props.comanda,
  (newComanda) => {
    comandaEditable.value = { ...newComanda };
  }
);
</script>
