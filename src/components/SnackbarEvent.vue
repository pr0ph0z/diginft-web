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
import { EventBus } from "@/eventBus";

export default {
  name: "SnackbarEvent",
  data() {
    return {
      show: false,
      timeout: 3000,
      content: "",
      variant: {
        success: {
          color: "green",
          button_color: "white",
        },
        warning: {
          color: "orange darken-1",
          button_color: "white",
        },
        error: {
          color: "red accent-2",
          button_color: "white",
        },
      },
      color: {
        color: "",
        button_color: "",
      },
    };
  },
  created() {
    EventBus.$on(
      "createSnackbar",
      ({ snackbar_message: snackbarMessage, variant }) => {
        this.show = true;
        this.content = snackbarMessage;
        this.color = this.variant[variant];
      }
    );
    EventBus.$on("dismiss", () => {
      this.show = false;
    });

    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "snackbar/showMessage") {
        this.content = state.snackbar.content;
        this.color = this.variant[state.snackbar.variant];
        this.show = true;
      }
      if (mutation.type === "snackbar/dismiss") {
        this.show = false;
      }
    });
  },
};
</script>
