<template>
  <v-dialog v-model="isDialogOpen" max-width="500">
    <v-card>
      <v-card-title>Producte</v-card-title>
      <v-card-text>
        <v-text-field label="Nom" v-model="editableProducte.nom"></v-text-field>
        <v-file-input
          label="Imatge"
          v-model="editableProducte.imatge"
          ref="imatge"
        ></v-file-input>
        <v-text-field
          label="Preu "
          v-model="editableProducte.preu"
          type="number"
        ></v-text-field>
        <v-text-field
          label="Estoc"
          v-model="editableProducte.estoc"
          type="number"
        ></v-text-field>
        <v-switch
          v-model="editableProducte.activat"
          color="primary"
          label="Activat"
          :false-value="0"
          :true-value="1"
          hide-details
        ></v-switch>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="cerrarDialogo">Cancelar</v-btn>
        <v-btn color="primary" text @click="guardarCambios">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import { postProductes } from "@/services/communicationManager";


const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "cerrar", "guardar"]);

const editableProducte = ref({});
const isDialogOpen = ref(props.modelValue);
const imatge = ref(null); 

watch(
  () => props.modelValue,
  (newValue) => {
    isDialogOpen.value = newValue;
    if (newValue) {
      editableProducte.value = { ...props.producte };
    }
  }
);

async function guardarCambios() {
  try {
    const productoData ={
      nom: editableProducte.value.nom,
      preu: editableProducte.value.preu,
      estoc: editableProducte.value.estoc,
      activat: editableProducte.value.activat,
    };

    const imageInput = document.querySelector('input[type="file"]');

    const producteCreat = await postProductes(productoData, imageInput.files[0] );
    
    editableProducte.value.id = producteCreat.id;

    cerrarDialogo();
  } catch (error) {
    console.error( `Error al guardar los cambios: ${error}`);
  }
}

const cerrarDialogo = () => {
  emit("update:modelValue", false);
  isDialogOpen.value = false;
  emit("cerrar");
};

watch(
  () => props.producte,
  (newProducte) => {
    editableProducte.value = { ...newProducte };
  }
);
</script>
