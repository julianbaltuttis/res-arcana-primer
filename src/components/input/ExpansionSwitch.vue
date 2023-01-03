<!--  Expansion Switch Component:
      Switch to change the activation state for a chosen expansion"".
      Calls Expansions to handle any user input that requests an activation change". -->
<template>
  <v-main
      class="px-0"
      fluid
  >
    <!--  Uses the passed in title as a label"-->
    <v-switch
        :input-value="this.switch.activated"
        @change="onToggle()"
        :label="`${this.switch.id}` + ' : ' + `${this.switch.title}`"
    ></v-switch>
  </v-main>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import Expansion from "@/types/Expansion";

@Component({
  components: {
  },
})
export default class ExpansionSwitch extends Vue {
  // Data flow: Expansions -> ExpansionSwitch
  @Prop() switch!:Expansion;

  // Triggers on switch toggle and emits its own Expansion object
  @Emit('switch-toggled')
  onToggle() {
    this.$log.debug('--> onToggle()');
    return this.switch;
  }

}
</script>

<style scoped>
</style>
