<!--  Generate Component:
      This is the call to action Generate button.
      It displays a random game setup dialog when pressed. -->
<template>
  <div>
    <v-btn @click="onGenerate()"
           :style="{left: '50%', transform:'translateX(-50%)'}">
      {{ $t('gui.callToAction') }}
    </v-btn>
    <GameSetup v-model="showSetupDialog"
               :places-of-power="randomPlaces"
               :all-places-of-power="placesOfPower"
               :monuments="availableMonuments"
               :fonts-need-coloring="fontsNeedColoring"
               @on-reload-request="onGenerate"
    />
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import GameSetup from "@/components/dialogs/GameSetup.vue";
import PlaceOfPower from "@/types/PlaceOfPower";

@Component({
  components: {
    GameSetup
  },
})
export default class Generate extends Vue {
  // data flow: App -> Main -> Generate
  @Prop() readonly placesOfPower!: Array<PlaceOfPower>;
  @Prop() readonly placesAmountToGenerate!: number;
  @Prop() availableMonuments!: number;
  @Prop() fontsNeedColoring!: boolean;

  // data variables
  title: string = 'Generate';
  showSetupDialog: boolean = false;
  randomPlaces: PlaceOfPower[] = [];
  randomFlippedPlace: PlaceOfPower[] = [];

  created() {
    this.$log.debug('--> Generate Button created()');
    this.$log.debug('Received', this.placesOfPower.length, 'places of power.');
    this.$log.debug('Maximum places of power to generate: ', this.placesAmountToGenerate);
    this.showSetupDialog = false;
  }

  /**
   * Generates a random set of places of power and displays the GameSetup Component.
   * Uses a map places -> ID in order to keep track of chosen places of power.
   * Shuffles all available places, then adds places one by one
   * and checks before adding whether its flip side has already been added.
   */
  onGenerate() {
    this.$log.debug('--> onGenerate(). Available places =', this.placesOfPower.length);
    let placesToId = new Map();
    let chosenPlaces: PlaceOfPower[] = [];
    const availablePlacesOfPower: PlaceOfPower[] = [... this.placesOfPower];
    const randomPlacesOfPower: PlaceOfPower[] = this.shufflePlacesOfPower(availablePlacesOfPower);
    this.$log.debug('we need to choose', this.placesAmountToGenerate, 'random places');

    for (let i = 0; i < this.placesAmountToGenerate; i++) {
      let placeIsValid = false;
      while (!placeIsValid) {
        let randomPlace: PlaceOfPower = randomPlacesOfPower.pop() as PlaceOfPower;
        let flipSideWasChosen = placesToId.has(randomPlace.flipSide);
        this.$log.debug('flip side already chosen', flipSideWasChosen);
        if (!flipSideWasChosen) {
          placesToId.set(randomPlace.title, randomPlace.id);
          chosenPlaces.push(randomPlace);
          this.$log.debug('Adding', randomPlace.title);
          placeIsValid = true;
        }
      }
    }
    this.randomPlaces = this.sortPlacesByColor(chosenPlaces);
    this.showSetupDialog = true;
    this.$log.debug('<-- onGenerate(). chosen places:', placesToId);
    placesToId.clear();
  }

  /**
   * Uses Fisher-Yates shuffle in order to randomize places of power for given array.
   * @param array the shuffled places of power.
   */
  shufflePlacesOfPower(array: PlaceOfPower[]): PlaceOfPower[] {
    this.$log.debug('--> shufflePlacesOfPower(array =', JSON.stringify(array, ["id"]), ').');
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    this.$log.debug('<-- shufflePlacesOfPower(). Return:', JSON.stringify(array, ["id"]));
    return array;
  }

  /**
   * Takes an array of places of power and sorts them by their color with orange first, then blue.
   * Note, all places where the id is an odd number are orange and
   * subsequently, all places where the id is an even number are blue.
   * @param places an array of places of power to be sorted.
   */
  sortPlacesByColor(places: PlaceOfPower[]) {
    let bluePlaces: PlaceOfPower[] = [];
    let orangePlaces: PlaceOfPower[] = [];
    for (const randomPlace of places) {
      if (randomPlace.id % 2 == 1) {
        orangePlaces.push(randomPlace);
      } else {
        bluePlaces.push(randomPlace);
      }
    }
    return orangePlaces.concat(bluePlaces);
  }


}
</script>

<style scoped>
</style>
