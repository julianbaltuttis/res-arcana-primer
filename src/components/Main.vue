<!--  Main Component:
      Displays the main part and call to action.
      Contains a button for generating random game setups.
      Contains a slider to change the number of players. -->
<template>
  <div class="flexbox-container">
    <!--      Call to action: Generate button-->

    <div class="flexbox-item">
      <!--     Uses a v-bind style to force center alignment-->
      <Generate :places-of-power="placesOfPower"
                :places-amount-to-generate="placesAmountToGenerate"
                :available-monuments="availableMonuments"
                :fonts-need-coloring="fontsNeedColoring"
      />

    </div>
    <v-spacer/>
    <!--          Slider: Pick amount of players-->
    <div class="flexbox-item">
      <PlayerSlider :core-set-only-rules-apply="coreSetOnlyRulesApply"
                    :current-player-count="currentPlayerCount"
                    @player-count-changed="onPlayerCountChanged"/>
    </div>


  </div>

</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
import PlaceOfPower from "@/types/PlaceOfPower";
import Generate from "@/components/buttons/Generate.vue";
import PlayerSlider from "@/components/input/PlayerSlider.vue";
import {Route} from "vue-router";

@Component({
  components: {
    PlayerSlider,
    Generate,
  },
})
export default class Main extends Vue {
  // data flow: App -> Main -> Generate
  @Prop() readonly placesOfPower!: Array<PlaceOfPower>;
  // data flow: App -> Main -> Generate
  @Prop() coreSetOnlyRulesApply!: boolean;
  @Prop() fontsNeedColoring!: boolean;
  @Prop() maximumMonumentCards!: number;
  @Prop() monumentsNeedBackwardsCounting!: boolean;
  // data flow Main <- PlayerSlider
  @Prop() currentPlayerCount!: number;


  // data flow: Main -> Generate
  availableMonuments: number = 10;
  placesAmountToGenerate: number = 5;


  created() {
    this.$log.debug('coreSetOnlyRulesApply:', this.coreSetOnlyRulesApply);
    this.placesAmountToGenerate = this.updatePlacesAmountToGenerate();

  }

  @Watch('placesOfPower', {immediate: true, deep: true})
  onAvailablePlacesOfPowerChange() {
    this.$log.debug('--> onAvailablePlacesOfPowerChange().');
    this.availableMonuments = this.updateAvailableMonuments();
  }

  @Watch('monumentsNeedBackwardsCounting', {immediate: true, deep: true})
  onBackwardsCountChange() {
    this.$log.debug('--> monumentsNeedBackwardsCounting():', this.monumentsNeedBackwardsCounting);
    this.availableMonuments = this.updateAvailableMonuments();

  }

  @Watch('coreSetOnlyRulesApply', {immediate: true, deep: true})
  onCoreSetChange() {
    this.$log.debug('--> onCoreSetChange().')
    this.placesAmountToGenerate = this.updatePlacesAmountToGenerate();
  }

  @Watch('$route', {immediate: true, deep: true})
  onQuery(route: Route) {
    this.$log.debug('--> onUrlChange(route =', route, ').');
    let query = this.$route.query;
    this.$log.debug('--> query:', query);
  }

  /**
   * Triggers when user makes changes to player slider.
   * Updates the amount of places to generate and the number of available monuments.
   * @param currentPlayerCount
   */
  @Emit('player-count-changed')
  onPlayerCountChanged(currentPlayerCount: number) {
    this.$log.debug('updated places of power maximum received:', currentPlayerCount);
    // this.currentPlayerCount = currentPlayerCount;

    if (this.coreSetOnlyRulesApply) {
      this.applyCoreSetRestrictions();
    } else {
      this.placesAmountToGenerate = currentPlayerCount + 2;
      this.availableMonuments = this.updateAvailableMonuments();
    }
    return currentPlayerCount;
  }

  applyCoreSetRestrictions() {
    this.$log.debug('--> applyCoreSetRestrictions()');
    this.placesAmountToGenerate = 5;
    this.availableMonuments = 10;
    this.$log.debug('<-- applyCoreSetRestrictions(). places Of Power Maximum:', this.placesAmountToGenerate, 'available Monuments:', this.availableMonuments);
  }

  /**
   * Updates available monuments for games that use at least one expansions.
   * Scales number of monuments according to number of players.
   */
  updateAvailableMonuments() {
    this.$log.debug('--> updateAvailableMonuments(). Backwards Counting: ', this.monumentsNeedBackwardsCounting);
    let availableMonuments: number = 10;
    if (!this.coreSetOnlyRulesApply) {
      if (this.currentPlayerCount == 2) {
        availableMonuments = 7;
      } else if (this.currentPlayerCount == 3) {
        availableMonuments = 10;
      } else if (this.currentPlayerCount == 4) {
        availableMonuments = 12;
      } else if (this.currentPlayerCount == 5) {
        availableMonuments = 14;
      }
    }
    if (this.monumentsNeedBackwardsCounting) {
      availableMonuments = this.getReverseMonumentCount(availableMonuments);
      this.$log.debug('Apply reverse count:', availableMonuments);
    }
    this.$log.debug('<-- updateAvailableMonuments(). Return:', availableMonuments);

    return availableMonuments;
  }

  getReverseMonumentCount(availableMonuments: number) {
    this.$log.debug('--> getReverseMonumentCount(). Available monuments:', availableMonuments);
    this.$log.debug('Maximum monuments count:', this.maximumMonumentCards);

    let backwardsCount: number = (this.maximumMonumentCards - availableMonuments) * (-1);
    this.$log.debug('<-- getReverseMonumentCount(). Return:', backwardsCount);
    return backwardsCount;
  }

  updatePlacesAmountToGenerate() {
    let maximum: number = 5;
    if (!this.coreSetOnlyRulesApply) {
      maximum = this.currentPlayerCount + 2;
    }
    return maximum;
  }
}
</script>

<style scoped>
.flexbox-container {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flexbox-item {
  margin: 10px;
  padding: 5px;
  /*border: 3px solid #333;*/
  /*background-color: goldenrod;*/
  width: 300px;
}
</style>
