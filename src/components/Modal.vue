<template>
  <v-dialog v-model="show" :max-width="maxWidth" :persistent="persistent">
    <v-card>
      <v-card-title class="headline"> {{ title }} </v-card-title>

      <v-card-text>
        {{ description }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="error darken-1" @click="handler" :loading="loading" text>
          {{ textButton }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Modal",
  props: {
    value: Boolean,
    handler: Function,
    loading: Boolean,
    title: String,
    description: String,
    textButton: String,
    maxWidth: {
      type: String,
      default: "290",
    },
    persistent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>
