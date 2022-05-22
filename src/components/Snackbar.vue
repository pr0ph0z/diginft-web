<template>
  <div class="text-center">
    <v-snackbar v-model="show" :timeout="timeout" :color="color.color">
      {{ content }}

      <template v-slot:action="{ attrs }">
        <v-btn
          :color="color.button_color"
          text
          v-bind="attrs"
          @click="show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "Snackbar",
  props: {
    show: Boolean,
    timeout: {
      type: Number,
      default: 3000,
    },
    content: String,
    color: Object,
  },
};
</script>
