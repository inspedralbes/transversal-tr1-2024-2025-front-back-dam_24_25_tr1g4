<template>
    <v-dialog v-model="isDialogOpen" max-width="500">
      <v-card>
        <v-card-title>Edició producte</v-card-title>
        <v-card-text>
          <v-text-field
            label="Nom"
            v-model="editableProducte.nom"
          ></v-text-field>
          <v-text-field
            label="Imatge"
            v-model="editableProducte.imatge"
            
          ></v-text-field>
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
 import { updateProducte } from "@/services/communicationManager";
 
 const props = defineProps({
   producte: {
     type: Object,
     required: true,
   },
   modelValue: {
     type: Boolean,
     required: true,
   },
 });
 
 const emit = defineEmits(["update:modelValue", "cerrar", "guardar"]);

 const editableProducte = ref({ ...props.producte });
 const isDialogOpen = ref(props.modelValue);
 
 watch(() => props.modelValue, (newValue) => {
   isDialogOpen.value = newValue;
   if (newValue) {
     editableProducte.value = { ...props.producte }; 
   }
 });
 
 async function guardarCambios() {
  try {
    await updateProducte(editableProducte.value); 
    emit('guardar', editableProducte.value);
    cerrarDialogo();
  } catch (error) {
    console.error('Error al guardar los cambios:', error);
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