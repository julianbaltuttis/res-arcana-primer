<!--  Expansions Component:
      Handles the selected expansions from the user.
      Allows either core set only or a combination of selected expansions.
      Handles all illegal states that the user might choose and makes corrections accordingly. -->
<template>
  <div>
    <v-btn
        elevation="2"
        icon
        dark
        large
        @click="onOptionsClicked"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>

  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Expansions extends Vue {
  @Prop() drawer: boolean = false;

  created() {
    this.$log.debug('--> created()');
  }

  @Emit('switch-drawer-visibility')
  onOptionsClicked() {
    this.$log.debug('--> onOptionsClicked()');
    return !this.drawer;
  }


}
</script>

<style scoped>

</style>
