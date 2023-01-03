<!--  Game Setup Component:
      Displays dialog with a number of random places of power.
      Uses vue flexbox classes for better scaling. -->
<template>
  <div>
    <v-dialog
        v-model="show"
        :key="componentKey"
        transition="dialog-top-transition"
        width="55vw"
        :fullscreen="$vuetify.breakpoint.xsOnly"

    >
      <v-card>
        <v-card-title class="black
                             lighten-2
                             mb-3">
          <v-list-item-title class="text-xs-h5
                                    text-md-h4
                                    text-xl-h3
                                    text-center
                                    font-weight-light
                                    white--text
                                    ma-1">
            {{ $t('gui.placesOfPower') }}
          </v-list-item-title>
        </v-card-title>

        <div class="flip-card"
             onclick="this.classList.toggle('hover')"
             :key="place.id"
             v-for="place in placesOfPower"
        >
          <div class="flip-card-content">
            <div class="front-card">
              <div class="container-grid-row">
                <!--          Image preview of place of power-->
                <v-img :src="getImagePath(place.image)"
                       position="center center"
                       max-height="50"/>
                <!--          title of place of power-->
                <div class="front-text
                            text-left
                            text-h6
                            mr-3
                            pt-2
                            pl-2
                            pb-2"
                     v-bind:class="getFontColor(place.id)"
                >
                  {{ place.title }}
                </div>

              </div>

              <div class="back-card container-grid-row">
                <!--          Image preview of place of power-->
                <v-img :src="getImagePath(getFlipSideFromMapping(place).image)"
                       position="center center"
                       max-height="50"/>
                <!--          title of place of power-->
                <div class="front-text
                            text-left
                            text-h6
                            mr-3
                            pt-2
                            pl-2
                            pb-2"
                     v-bind:class="getFontColor(place.id +1)">
                  {{ getFlipSideFromMapping(place).title }}
                </div>
              </div>

            </div>

          </div>
        </div>

        <!--        buttons for closing and reloading-->
        <v-card-actions class="justify-end">
          <v-list-item-subtitle class="
          text-xs-body-2
          text-md-subtitle-1
          text-xl-h5
          ma-2">
            {{ $t('gui.monuments') }}: {{ monuments }}
          </v-list-item-subtitle>
          <v-btn
              color="green darken-1"
              text
              :small="$vuetify.breakpoint.xsOnly"
              @click="onReload()"
          >
            {{ $t('gui.reload') }}
          </v-btn>
          <v-btn color="primary"
                 text
                 :small="$vuetify.breakpoint.xsOnly"
                 @click.stop="show=false"
          >{{ $t('gui.close') }}
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
import PlaceOfPower from "@/types/PlaceOfPower";
import PlayerSlider from "@/components/input/PlayerSlider.vue";

@Component({
  components: {PlayerSlider},
})
export default class GameSetup extends Vue {
  @Prop() placesOfPower!: PlaceOfPower[];
  @Prop() value!: boolean;
  @Prop() monuments!: number;
  @Prop() allPlacesOfPower!: Array<PlaceOfPower>;
  @Prop() fontsNeedColoring!: boolean;
  placesToFlipSide = new Map();
  componentKey: number = 0;


  @Watch('placesOfPower', {immediate: true, deep: true})
  onAvailablePlacesOfPowerChange() {
    this.$log.debug('--> onAvailablePlacesOfPowerChange().');
    this.generateFlipSideMap()
  }

  // @Watch('fontsNeedColoring', {immediate: true, deep: true})
  // onFontsNeedColoringChange() {
  //   this.$log.debug('--> onFontsNeedColoringChange(). Set to: ', this.fontsNeedColoring);
  // }

  getImagePath(filename: string) {
    return require('../../assets/' + filename);
  }

  getFontColor(id: number) {
    this.$log.debug('--> getFontColor(). Id =: ', id);

    let fontColor: string = "";
    // const idNumber: number = Number(id);
    const isBlue: boolean = id % 2 == 0;
    if (!this.fontsNeedColoring) {
      fontColor = "text--black";
      this.$log.debug('--> set color to: ', fontColor);
    } else if (isBlue) {
      fontColor = "text--blue";
      this.$log.debug('--> set color to: ', fontColor);
    } else {
      fontColor = "text--orange";
      this.$log.debug('--> set color to: ', fontColor);
    }
    this.$log.debug('<-- getFontColor(). Return: ', fontColor);
    return fontColor;
  }

  get show() {
    return this.value;
  }

  set show(value) {
    this.$emit('input', value);
  }

  @Emit('on-reload-request')
  onReload() {
    this.$log.debug('--> onReload(). Emit reload request');
    this.componentKey++;
    return true;
  }

  generateFlipSideMap() {
    this.$log.debug('--> generateFlipSideMap()');

    for (const placeOfPower of this.placesOfPower) {
      let key: string = placeOfPower.title;
      let value: PlaceOfPower = this.getFlipSide(placeOfPower);
      this.$log.debug('--> key:', key, 'value:', JSON.stringify(value));
      this.placesToFlipSide.set(key, value);
    }
    this.$log.debug('<-- generateFlipSideMap()');
  }

  getFlipSide(placeOfPower: PlaceOfPower): PlaceOfPower {
    this.$log.debug('--> getFlipSide()', placeOfPower.title);

    return this.allPlacesOfPower.find(a => a.title == placeOfPower.flipSide) as PlaceOfPower;
  }

  getFlipSideFromMapping(placeOfPower: PlaceOfPower) {
    return this.placesToFlipSide.get(placeOfPower.title) as PlaceOfPower;
  }

}
</script>

<style scoped>
/*Enforces a center alignment*/

.container-grid-row {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-auto-flow: column;
  padding-top: 0.3em;
  padding-bottom: 0.3em;
  padding-left: 1rem;
}

.container-grid-row:hover {
  background-color: lightgray;
  cursor: grab;
}

.flip-card-content {
  transition: transform 0.8s;
  transform-style: preserve-3d;
  perspective: 1000px;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
/*.flip-card:hover .flip-card-content {*/
/*  transform: rotateX(.5turn);*/
/*}*/

.flip-card.hover .flip-card-content {
  transform: rotateX(.5turn);
}


.front-card {
  position: relative;
  background: white;
}

.back-card {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transform: rotateX(.5turn);
  background: white;
}

/* Position the front and back side */
.front-card,
.back-card {
  /*  position: absolute;*/
  /*  width: 100%;*/
  /*  height: 100%;*/
  /*  -webkit-backface-visibility: hidden; !* Safari *!*/
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.text--blue {
  color: var(--clr-deep-blues);
  /*color: blue;*/
}

.text--orange {
  color: var(--clr-sunny-side);
  /*color: orange;*/
}

.text--black {
  /*background-color: white;*/
  color: black;
}

</style>
