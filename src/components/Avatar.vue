<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMinYMin meet"
    viewBox="0 0 500 500"
    :width="width"
  >
    <path
      d="M100,100 h200 a20,20 0 0 1 20,20 v200 a20,20 0 0 1 -20,20 h-200 a20,20 0 0 1 -20,-20 v-200 a20,20 0 0 1 20,-20 z"
    />
    <defs>
      <linearGradient id="c" gradientTransform="rotate(45)">
        <stop offset="5%" :stop-color="`hsl(${hueStart(address)},69%,90%)`" />
        <stop offset="95%" :stop-color="`hsl(${hueEnd(address)},69%,90%)`" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#c)" />
    <rect
      x="110"
      y="69"
      width="50%"
      height="67%"
      rx="5"
      fill="#33333310"
      filter="url(#s)"
    />
  </svg>
</template>

<script>
export default {
  name: "Avatar",
  props: {
    address: String,
    width: String,
  },
  methods: {
    addrToHue(address) {
      return (parseInt(address, 16) / 65536) % 360;
    },
    hueStart(address) {
      return this.addrToHue(address) + 120;
    },
    hueEnd(address) {
      return this.addrToHue(address);
    },
  },
};
</script>
