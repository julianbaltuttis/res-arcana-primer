<!--  App Component:
      Displays the Header and the Main component.
      Loads all locale data and provides the correct format for other components. -->
<template>
  <v-app>
    <v-main>
      <Header @switch-drawer-visibility="onSwitchDrawerVisibility"
              :drawer-is-visible="drawer"
      />

      <Main :places-of-power="placesOfPower"
            :core-set-only-rules-apply="coreSetOnlyRulesApply"
            :fonts-need-coloring="applicationSettings.coloredLabels"
            :current-player-count="applicationSettings.playerCount"
            :monuments-need-backwards-counting="applicationSettings.countBackwards"
            :maximum-monument-cards="maximumMonumentCards"
            @player-count-changed="onPlayerCountChanged"
      />
    </v-main>
    <v-navigation-drawer
        v-model="drawer"
        app
        right
        bottom
        temporary
    >
      <OptionsDrawer @switch-drawer-visibility="onSwitchDrawerVisibility"
                     :expansions="expansions"
                     :fonts-need-coloring="applicationSettings.coloredLabels"
                     :monuments-need-backwards-counting="applicationSettings.countBackwards"
                     @colorize-fonts-change="onColorizedFontsChange"
                     @backwards-count-change="onBackwardsCountChange"
                     @selected-expansions-change="onSelectedExpansionsChanged"/>
    </v-navigation-drawer>

    <Footer/>
  </v-app>
</template>

<script lang="ts">
import {Component, Emit, Vue, Watch} from 'vue-property-decorator';
import Header from "@/components/Header.vue";
import Expansion from "@/types/Expansion.ts";
import PlaceOfPower from "@/types/PlaceOfPower.ts";
import Main from "@/components/Main.vue";
import i18n from "@/i18n";
import {Route} from 'vue-router';
import AvailablePlaces from "@/types/AvailablePlaces.ts";
import Footer from "@/components/Footer.vue";
import ExpansionSwitch from "@/components/input/ExpansionSwitch.vue";
import OptionsDrawer from "@/components/input/OptionsDrawer.vue";
import {Dictionary} from 'vue-router/types/router';
import configuration from "@/config/configuration.json";
import ApplicationSettings from "@/types/ApplicationSettings";

@Component({
  components: {
    OptionsDrawer,
    Footer,
    Main,
    Header,
    ExpansionSwitch,
  },
})
export default class App extends Vue {
  // data flow: App -> Main -> Generate
  placesOfPower: PlaceOfPower[] = [];
  coreSetOnlyRulesApply: boolean = false;
  // currentPlayerCount: number = 3;
  applicationSettings: ApplicationSettings = {} as ApplicationSettings;

  // data flow: App -> Header -> Expansions
  expansions: Expansion[] = [];

  // data variables
  expansionToPlaces: AvailablePlaces[] = []; // flat mapping of configured places of power
  drawer: boolean = false;
  // count: string = "";
  // labels: string = "";


  created() {
    this.$log.debug('--> created()');
    this.loadLocaleData();

    // http://localhost:8080/en/?count=forward&labels=colored

    let query: Dictionary<string> = this.$route.query as Dictionary<string>;
    this.applicationSettings = configuration.ApplicationSettings;
    this.handleQueryStrings(query);
    // this.count = this.$route.query.count as string;
    // this.labels = this.$route.query.labels as string
    this.loadRouterUrl();
  }

  handleQueryStrings(query: Dictionary<string>) {
    this.$log.debug('--> handleQueryStrings( query =', query, ')');

    this.handleLabelsQuery(query);
    this.handleCountingQuery(query);
    this.handlePlayerCountQuery(query);
    this.handleExpansionsQuery(query);

  }

  handleLabelsQuery(query: Dictionary<string>) {
    if (query.coloredLabel != null) {
      const queriedLabels: boolean = !!query.coloredLabel;
      if (queriedLabels) {
        this.applicationSettings.coloredLabels = true;
      } else {
        this.applicationSettings.coloredLabels = false;
      }
    }
  }

  handleCountingQuery(query: Dictionary<string>) {
    if (query.countBackwards != null) {
      const queriedCountBackwards = !!query.countBackwards;
      if (queriedCountBackwards) {
        this.applicationSettings.countBackwards = true;
      } else {
        this.applicationSettings.countBackwards = false;
      }
    }
  }

  handlePlayerCountQuery(query: Dictionary<string>) {
    if (query.playerCount != null) {
      const queriedPlayerCount: number = +query.playerCount;
      this.$log.debug('--> queriedPlayerCount =', queriedPlayerCount);

      if (queriedPlayerCount > 1 && queriedPlayerCount < 6) {
        this.applicationSettings.playerCount = queriedPlayerCount;
      }
    }
  }

  handleExpansionsQuery(query: Dictionary<string>) {
    this.$log.debug('--> handleExpansionsQuery( query =', query, ')');
    // http://localhost:8080/en/?base=true&lux=false
    // http://localhost:8080/en/?base=false&lux=true&pearl=false&countBackwards=true&coloredLabels=false&playerCount=3
    // http://localhost:8080/en/?base=false&lux=true&pearl=false&countBackwards=true&coloredLabels=false&playerCount=5

    Object.entries(query)
        .filter(([key]) => key === 'base' || key === 'lux' || key === 'pearl')
        .forEach(([key, value]) => {
              this.setExpansion(key, JSON.parse(value))
            }
        );
  }

  setExpansion(dataKey: string, activated: boolean) {
    this.$log.debug('--> setExpansion( dataKey =', dataKey, ', activated', activated, ')');

    const queriedExpansion = this.expansions.find(x => x.dataKey === dataKey);
    if (queriedExpansion !== undefined) {
      queriedExpansion.activated = activated;
      this.$log.debug('queriedExpansion.activated:', queriedExpansion.activated);
    }
  }

  @Emit('switch-drawer-visibility')
  onSwitchDrawerVisibility(showDrawer: boolean) {
    this.$log.debug('show drawer update received:', showDrawer);
    this.drawer = showDrawer;
  }

  /**
   * Loads and updates the following data from current locale:
   * places of power, expansions and
   */
  loadLocaleData() {
    this.$log.debug('--> loadLocaleData()');
    this.expansions = (i18n.t('expansions') as unknown) as Expansion[];
    this.$log.debug('expansions =', JSON.stringify(this.expansions));
    this.expansionToPlaces = (i18n.t('placesOfPower') as unknown) as AvailablePlaces[];
    this.placesOfPower = this.updatePlacesOfPower();
    this.coreSetOnlyRulesApply = this.isCoreSetOnlySelected();
    this.$log.debug('<-- loadLocaleData()');
  }

  @Watch('applicationSettings', {immediate: true, deep: true})
  loadRouterUrl() {
    this.$log.debug('--> applicationSettings()');
    // let countBackwards = this.applicationSettings.countBackwards;
    // this.$router.push({query: {countBackwards: 'true'}});
    this.addParamsToLocation(this.applicationSettings);
  }

  addParamsToLocation(params: ApplicationSettings) {
    this.$log.debug('--> addParamsToLocation(). Current path:', this.$route.path);
    history.pushState(
        {},
        "",
        '/res-arcana-primer' +
        this.$route.fullPath +
        '?' +
        Object.keys(params)
            .map(key => {
              return (
                  encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
              )
            })
            .join('&')
    )
  }

  /**
   * Watches four locale changes from router and reloads the data
   * @param route
   */
  @Watch('$route', {immediate: true, deep: true})
  onUrlChange(route: Route) {
    this.$log.debug('--> onUrlChange(route =', route, ').');
    this.loadLocaleData();
  }

  onColorizedFontsChange(fontsNeedColoring: boolean) {
    this.$log.debug('--> onColorizedFontsChange(). Request Received for fonts coloring:', fontsNeedColoring);
    this.applicationSettings.coloredLabels = fontsNeedColoring;
  }

  onBackwardsCountChange(monumentsNeedBackwardsCounting: boolean) {
    this.$log.debug('--> onBackwardsCountChange(). Request Received for backwards counting:', monumentsNeedBackwardsCounting);
    this.applicationSettings.countBackwards = monumentsNeedBackwardsCounting;
  }

  /**
   * Triggers when user changes selected expansions.
   * Updates places of power according to selected expansions.
   * Sets variables for core set only rules if applicable.
   * @param expansions
   */
  onSelectedExpansionsChanged(expansions: Expansion[]) {
    this.$log.debug('--> onSelectedExpansionsChanged(). Received:', JSON.stringify(expansions));
    this.placesOfPower = this.updatePlacesOfPower();
    this.coreSetOnlyRulesApply = this.isCoreSetOnlySelected();

    expansions.forEach(a => this.setApplicationSetting(a.dataKey, a.activated));
  }

  setApplicationSetting(dataKey: string, value: boolean) {
    this.applicationSettings[dataKey] = value;
  }

  /**
   * Checks whether user has selected Core Set only in expansions options.
   */
  isCoreSetOnlySelected() {
    const coreActivation: boolean = this.expansions[0].activated;
    const promoActivation: boolean = (this.expansions[1].dataKey.includes("promo") && this.expansions[1].activated)
    this.$log.debug('coreActivation:', coreActivation);
    const onlyCoreOrPromoIsSelected: boolean = coreActivation || promoActivation;
    return onlyCoreOrPromoIsSelected;
  }

  get maximumMonumentCards() {
    this.$log.debug('--> get maximumMonumentCards(). Available Places of Power:', this.placesOfPower.length);

    // this.$log.debug('<-- get maximumMonumentCards(). Set to:', this.maximumMonumentCards);
    return this.placesOfPower.length;
  }

  set maximumMonumentCards(value) {
    this.$emit('input', value);
  }

  /**
   * Loads available places of power according to selected expansions.
   * Will always load places from core set.
   * Will only load places from an expansion if that expansion was selected by user.
   */
  updatePlacesOfPower() {
    this.$log.debug('--> updateAvailablePlacesOfPower()');
    let placesOfPower: PlaceOfPower[] = []

    // Loads all core set places and each expansion place that is activated
    for (const expansion of this.expansions) {
      const isCoreSet: boolean = expansion.id == 1;
      const expansionNeedsLoading: boolean = expansion.activated == true && !isCoreSet;
      if (isCoreSet || expansionNeedsLoading) {
        let dataKey: string = expansion.dataKey;
        this.$log.debug('dataKey:', dataKey);

        let loadedPlaces: PlaceOfPower[] = (this.expansionToPlaces[dataKey]) as PlaceOfPower[];
        for (const place of loadedPlaces) {
          placesOfPower.push(place);
        }
      }
    }
    this.$log.debug('<-- updateAvailablePlacesOfPower(). Return:', JSON.stringify(placesOfPower, ["title"]));
    return placesOfPower;
  }

  onPlayerCountChanged(currentPlayerCount: number) {
    this.applicationSettings.playerCount = currentPlayerCount;
  }
}

</script>

<style>
.outline {
  border: 3px solid #333;
}

/* Grid
–––––––––––––––––––––––––––––––––––––––––––––––––– */
.container {
  position: relative;
  width: 100%;
  max-width: 960px;
  margin: 10px auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.column,
.columns {
  width: 100%;
  float: left;
  box-sizing: border-box;
}

/* For devices larger than 400px */
@media (min-width: 400px) {
  .container {
    width: 85%;
    padding: 0;
  }
}

/* For devices larger than 550px */
@media (min-width: 550px) {
  .container {
    width: 80%;
  }

  .column,
  .columns {
    margin-left: 4%;
  }

  .column:first-child,
  .columns:first-child {
    margin-left: 0;
  }

  .one.column,
  .one.columns {
    width: 4.66666666667%;
  }

  .two.columns {
    width: 13.3333333333%;
  }

  .three.columns {
    width: 22%;
  }

  .four.columns {
    width: 30.6666666667%;
  }

  .five.columns {
    width: 39.3333333333%;
  }

  .six.columns {
    width: 48%;
  }

  .seven.columns {
    width: 56.6666666667%;
  }

  .eight.columns {
    width: 65.3333333333%;
  }

  .nine.columns {
    width: 74.0%;
  }

  .ten.columns {
    width: 82.6666666667%;
  }

  .eleven.columns {
    width: 91.3333333333%;
  }

  .twelve.columns {
    width: 100%;
    margin-left: 0;
  }

  .one-third.column {
    width: 30.6666666667%;
  }

  .two-thirds.column {
    width: 65.3333333333%;
  }

  .one-half.column {
    width: 48%;
  }

  /* Offsets */
  .offset-by-one.column,
  .offset-by-one.columns {
    margin-left: 8.66666666667%;
  }

  .offset-by-two.column,
  .offset-by-two.columns {
    margin-left: 17.3333333333%;
  }

  .offset-by-three.column,
  .offset-by-three.columns {
    margin-left: 26%;
  }

  .offset-by-four.column,
  .offset-by-four.columns {
    margin-left: 34.6666666667%;
  }

  .offset-by-five.column,
  .offset-by-five.columns {
    margin-left: 43.3333333333%;
  }

  .offset-by-six.column,
  .offset-by-six.columns {
    margin-left: 52%;
  }

  .offset-by-seven.column,
  .offset-by-seven.columns {
    margin-left: 60.6666666667%;
  }

  .offset-by-eight.column,
  .offset-by-eight.columns {
    margin-left: 69.3333333333%;
  }

  .offset-by-nine.column,
  .offset-by-nine.columns {
    margin-left: 78.0%;
  }

  .offset-by-ten.column,
  .offset-by-ten.columns {
    margin-left: 86.6666666667%;
  }

  .offset-by-eleven.column,
  .offset-by-eleven.columns {
    margin-left: 95.3333333333%;
  }

  .offset-by-one-third.column,
  .offset-by-one-third.columns {
    margin-left: 34.6666666667%;
  }

  .offset-by-two-thirds.column,
  .offset-by-two-thirds.columns {
    margin-left: 69.3333333333%;
  }

  .offset-by-one-half.column,
  .offset-by-one-half.columns {
    margin-left: 52%;
  }

}
</style>
