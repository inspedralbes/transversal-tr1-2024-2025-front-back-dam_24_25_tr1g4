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
          <v-textarea
            label="Productes"
            v-model="comandaEditable.productes"
            disabled
          ></v-textarea>
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
  <script>
  import { ref } from "vue";
  import { updateComanda } from "@/services/communicationManager";
  
  export default {
    props: {
      comanda: {
        type: Object,
        required: true,
      },
      modelValue: {
        type: Boolean,
        required: true,
      },
      
    },
    setup(props, { emit }) {
      const comandaEditable = ref({ ...props.comanda });
      const isDialogOpen = ref(false);
  
      const abrirDialogo = () => {
        isDialogOpen.value = true;
        comandaEditable.value = { ...props.comanda };
      };
  
      const cerrarDialogo = () => {
        emit("update:modelValue", false);
        isDialogOpen.value = false;
        emit("cerrar");
      };
  
      const guardarCambios = async () => {
        try {
          const updatedComanda = await updateComanda(comandaEditable.value.id, { estat: comandaEditable.value.estat });
          emit("guardar", updatedComanda); 
          cerrarDialogo(); 
        } catch (error) {
          console.error('Error al guardar los cambios:', error);
        }
      };
      if (props.modelValue) {
        abrirDialogo();
      }

      return {
        comandaEditable,
        isDialogOpen,
        cerrarDialogo,
        guardarCambios,
      };
    },
  };
  </script>
  