<template>
  <v-alert type="success" dismissible @input="onClose" :value="true" :outline="true">
    {{ text }}
  </v-alert>
<!--   <v-snackbar color="error" :value="true" top :timeout="0">
      {{ text }}
      <v-btn dark flat @click="onClose">
        Close
      </v-btn>
    </v-snackbar> -->
</template>

<script>
export default {
  props: ['text'],
  methods: {
    onClose () {
      this.$emit('dismissed')
    }
  }
}
</script>
