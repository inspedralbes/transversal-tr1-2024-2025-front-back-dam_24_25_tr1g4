<template>
    <v-dialog v-model="isDialogOpen" max-width="500">
      <v-card>
        <v-card-title>Edició producte</v-card-title>
        <v-card-text>
          <v-text-field
            label="ID"
            v-model="editableProducte.nom"
            disabled
          ></v-text-field>
          <v-text-field
            label="ID User"
            v-model="editableProducte.imatge"
            disabled
          ></v-text-field>
          <v-text-field
            label="Preu Total"
            v-model="editableProducte.preu"
            type="number"
            disabled
          ></v-text-field>
          <v-text-field
            label="Estat"
            v-model="editableProducte.estoc"
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



  </script>