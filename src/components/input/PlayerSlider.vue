<!-- A slider that allows the user to pick the number of players. -->
<template>
  <v-main>
    <div v-if="sliderNeedsVisibility()">
      <div class="text-center text-sm-body-2">{{$t('gui.playerSlider')}}</div>
      <v-slider v-model="sliderValue"
                min="2"
                :max="maxPlayerCount"
                ticks="always"
                :tick-labels="ticksLabels"
                @change="onPlayerCountChange(sliderValue)"
      />
    </div>
  </v-main>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class PlayerSlider extends Vue {
  // data flow: App -> Main -> PlayerSlider
  @Prop() coreSetOnlyRulesApply!: boolean;

  // data variables
  @Prop() currentPlayerCount!: number;
  ticksLabels: number[] = [2, 3, 4, 5]
  maxPlayerCount: number = 5;
  sliderValue: number = 3;

  created() {
    this.$log.debug('--> created()');
    this.$log.debug('maximum Players:', this.maxPlayerCount);
    this.sliderValue = this.currentPlayerCount;
  }
  /**
   * Emits a player count changed event whenever the user changes the slider input.
   * Event `player-count-changed` is emitted to Main.
   *
   * @param newValue The new value of the slider after the user has changed it.
   */
  @Emit('player-count-changed')
  onPlayerCountChange(newValue: number) {
    this.$log.debug('current player count change to: ', newValue);
    return newValue;
  }

  /**
   * Checks whether player slider needs to be hidden.
   * Slider needs to be hidden if core set only rules are applied.
   *
   */
  sliderNeedsVisibility() {
    this.$log.debug('--> sliderNeedsVisibility(). coreSetOnlyRulesApply:', this.coreSetOnlyRulesApply);
    let showSlider = true;
    if (this.coreSetOnlyRulesApply) {
      this.$log.debug('Showing slider.')
      showSlider = false;
      // this.onPlayerCountChange(this.getDefaultPlayerCount());
    }
    this.$log.debug('<-- sliderNeedsVisibility(). Return:', showSlider)
    return showSlider;
  }

}
</script>

<style scoped>

</style>
