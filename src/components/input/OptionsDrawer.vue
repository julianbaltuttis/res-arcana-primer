<template>
  <v-list-item-group class="mx-3">
    <v-btn
        icon
        @click.stop=onOptionsClicked
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
    <v-divider/>
    <v-list-item-title class="text-center font-weight-bold mt-3">{{ $t('gui.expansions') }}</v-list-item-title>
    <v-list>
      <div :key="expansionSwitch.id" v-for="expansionSwitch in expansions">
        <!--  Passes down all switch object data to ExpansionSwitch component-->
        <ExpansionSwitch :switch="expansionSwitch"
                         @switch-toggled="switchToggled"/>
      </div>
    </v-list>
    <v-divider/>
    <v-list-item-title class="text-center font-weight-bold mt-3">{{ $t('gui.displayOptions') }}</v-list-item-title>
    <v-switch
        :input-value="monumentsNeedBackwardsCounting"
        @change="onCountToggle()"
        :label="getCountBackwardsLabel()"
    ></v-switch>
    <v-switch
        :input-value="fontsNeedColoring"
        @change="onColorizeToggle()"
        :label="colorizeFontsLabel"
    ></v-switch>
  </v-list-item-group>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
import Expansion from "@/types/Expansion";
import ExpansionState from "@/types/ExpansionState";
import i18n from "@/i18n";
import Gui from "@/types/Gui";
import ExpansionSwitch from "@/components/input/ExpansionSwitch.vue";

@Component({
  components: {
    ExpansionSwitch
  },
})
export default class OptionsDrawer extends Vue {
  // data flow: App -> Header -> Expansions
  @Prop() expansions!: Expansion[];
  @Prop() fontsNeedColoring!: boolean;
  @Prop() monumentsNeedBackwardsCounting!: boolean;

  currentState: ExpansionState = this.updateCurrentState();
  drawer: boolean = false;

  // fontsNeedColoring: boolean = true;


  created() {
    this.$log.debug('--> created()');
    this.$log.debug('expansion switches received:', JSON.stringify(this.expansions));
    let currentStateIsIllegal: boolean = this.isStateIllegal(this.currentState);
    if (currentStateIsIllegal) {
      this.setCoreSetState(true);
      this.disableAllExpansions();
    }
  }


  get colorizeFontsLabel() {
    const guiSettings = (i18n.t('gui') as unknown) as Gui;
    const label: string = guiSettings.colorizeLabels as string;
    return label;
  }

  set colorizeFontsLabel(value: string) {
    this.colorizeFontsLabel = value;
  }

  getCountBackwardsLabel() {
    const guiSettings = (i18n.t('gui') as unknown) as Gui;
    const label: string = guiSettings.countBackwards as string;
    return label;
  }


  @Emit('colorize-fonts-change')
  onColorizeToggle() {
    this.$log.debug('--> onColorizeToggle(). Do Color Magic here.');
    // this.fontsNeedColoring = !this.fontsNeedColoring;
    this.$log.debug('--> Requesting fonts need coloring:', this.fontsNeedColoring);
    return !this.fontsNeedColoring;
  }

  @Emit('backwards-count-change')
  onCountToggle() {
    this.$log.debug('--> onCountToggle(). Do Reverse Magic here.');
    // this.monumentsNeedBackwardsCounting = !this.monumentsNeedBackwardsCounting;
    this.$log.debug('--> Requesting backwards counting:', this.monumentsNeedBackwardsCounting);
    return !this.monumentsNeedBackwardsCounting;
  }

  /**
   * Watches for locale change and updates current state accordingly if expansionSwitches change.
   * Calls onCoreSetChange to emit a possible change of expansions.
   * @param proposedState the change request containing info on whether the core is activated and how many expansions are activated.
   */
  @Watch('expansions', {immediate: true, deep: true})
  onExpansionSwitchChanged() {
    this.$log.debug('--> onExpansionSwitchChanged');
    this.currentState = this.updateCurrentState();
    this.onCoreSetChange();
  }

  @Emit('selected-expansions-change')
  onCoreSetChange() {
    this.$log.debug('--> onCoreSetChange()');
    return this.expansions;
  }

  @Emit('switch-drawer-visibility')
  onOptionsClicked() {
    this.$log.debug('--> onOptionsClicked()');
    return false;
  }

  /**
   * Listens for a change request from an expansion switch and handles logic accordingly.
   Generates a proposed state based on the given expansion switch and checks whether the requested change is legal.
   If the proposed request leads to legal state, changes the state of the expansion switch accordingly.
   Else fixes the proposed request by creating a compromise and then switches states accordingly.
   * @param requestedState
   */
  switchToggled(expansionSwitch: Expansion) {
    this.$log.debug('--> switchToggled(id=', JSON.stringify(expansionSwitch), ')');
    let switchRequest = this.cloneSwitchWithInverseActivatedState(expansionSwitch);
    this.$log.debug('requested switch:', JSON.stringify(switchRequest));
    let proposedState = this.generateProposedState(switchRequest);
    let proposedStateIsIllegal: boolean = this.isStateIllegal(proposedState);
    if (proposedStateIsIllegal) {
      this.fixIllegalStateChange(switchRequest);
    } else {
      this.changeState(switchRequest);
    }
    this.currentState = this.updateCurrentState();
  }

  /**
   * Creates a copy of given expansion switch with a reversed state, representing a switch request.
   */
  cloneSwitchWithInverseActivatedState(expansionSwitch: Expansion): Expansion {
    return {
      id: expansionSwitch.id,
      title: expansionSwitch.title,
      activated: !expansionSwitch.activated,
      dataKey: expansionSwitch.dataKey
    };
  }

  /**
   * Generates a proposed state from the given switch.
   * Note, an expansion states contains information on whether the core is active and how many expansions are active.
   * @param proposedState the expansion switch containing the information for the change request.
   */
  generateProposedState(expansionSwitch: Expansion): ExpansionState {
    this.$log.debug('--> generateProposedState(expansionSwitch =', JSON.stringify(expansionSwitch), ')');
    let proposedState: ExpansionState = JSON.parse(JSON.stringify(this.currentState));
    this.$log.debug('current state:', JSON.stringify(proposedState));
    if (this.isCoreSet(expansionSwitch)) {
      proposedState.coreIsActive = !proposedState.coreIsActive;
    } else if (expansionSwitch.activated == true) {
      proposedState.numberOfActiveExpansions++;
    } else if (expansionSwitch.activated == false) {
      proposedState.numberOfActiveExpansions--;
    }
    this.$log.debug('<-- generateProposedState():', JSON.stringify(proposedState));
    return proposedState;
  }

  /**
   * Checks if given proposed state is legal. We differentiate between 2 types of illegal states:
   * 1. Core and expansion mismatch: A change request leads to both the core set and expansions being activated.
   * 2. Everything inactive: A change request leads to core set and all expansions being deactivated.
   *
   * @param proposedState the change request containing info on whether the core is activated and how many expansions are activated.
   */
  isStateIllegal(proposedState: ExpansionState): boolean {
    this.$log.debug('--> isStateIllegal(proposedState =', JSON.stringify(proposedState), ')');
    let isIllegal: boolean = false;

    const coreAndExpansionMismatch: boolean = proposedState.coreIsActive && proposedState.numberOfActiveExpansions > 0;
    const everythingInactive: boolean = !proposedState.coreIsActive && proposedState.numberOfActiveExpansions < 1;

    if (coreAndExpansionMismatch || everythingInactive) {
      this.$log.debug('proposedState is illegal:', 'coreAndExpansionMismatch:', coreAndExpansionMismatch, 'everythingInactive:', everythingInactive);
      isIllegal = true;
    }
    this.$log.debug('<-- isStateIllegal(). Return', isIllegal);
    return isIllegal;
  }

  /**
   * Fixes illegal state from a given change request. Handles the following cases:
   * case: Core set is activated, but so are expansions -> enable core, disable rest.
   * case: Core set is deactivated, but no expansions are active -> deactivate core, activate first expansion.
   * case: expansion is activated, but so is core -> deactivate core, activate expansion.
   * case: expansion is deactivated, but it is the last one -> deactivate expansion, activate core.
   *
   * @param switchRequest
   */
  fixIllegalStateChange(switchRequest: Expansion) {
    this.$log.debug('--> fixIllegalState(switchRequest=', JSON.stringify(switchRequest), ')');
    const isCoreSet: boolean = this.isCoreSet(switchRequest);
    const wantsToActivate: boolean = switchRequest.activated;

    if (isCoreSet) {
      if (wantsToActivate) {
        // case: Core set wants to activate, but expansions are also activated
        this.$log.debug('Apply Fix: Enabling core and disabling all expansions.');
        this.disableAllExpansions();
        this.setCoreSetState(true);
      } else {
        // case: core set wants to deactivate, but no expansions are active
        this.$log.debug('Apply Fix: Disabling core and enabling first expansion.');
        this.setCoreSetState(false);
        this.setExpansionState(this.expansions[1].id, true);
      }
    } else if (!isCoreSet) {
      if (wantsToActivate) {
        // case: expansions wants to activate, but core is active
        this.$log.debug('Apply Fix: Disabling core and enabling expansion:', switchRequest.title);
        this.setCoreSetState(false);
        this.setExpansionState(switchRequest.id, true);
      } else {
        // case: expansion wants to deactivate, but it's the last one and core isn't active
        this.$log.debug('Apply Fix: Disabling core and disabling expansion:', switchRequest.title);
        this.setCoreSetState(true);
        this.setExpansionState(switchRequest.id, false);
      }
    }
  }

  /**
   * Handles a given change request and applies changes accordingly. Differentiates between core set and expansion requests.
   * @param switchRequest the given expansion switch that contains the info for the change request.
   */
  changeState(switchRequest: Expansion) {
    this.$log.debug('--> changeState(switchRequest =', JSON.stringify(switchRequest), ')')
    const isCoreSet: boolean = this.isCoreSet(switchRequest);
    const newState: boolean = switchRequest.activated;

    if (isCoreSet) {
      this.setCoreSetState(newState);
    } else {
      this.setExpansionState(switchRequest.id, newState);
    }
    this.$log.debug('--> changeState()');
  }

  /**
   * Checks the current state of each expansion object in expansionSwitches and creates an Expansion State object.
   * Note, an expansion states contains information on whether the core is active and how many expansions are active.
   */
  updateCurrentState() {
    this.$log.debug('--> updateCurrentState().')
    let count: number = 0;
    let coreIsActive: boolean = false;
    for (const expansion of this.expansions) {
      let isCoreSet: boolean = expansion.id == 1;
      if (isCoreSet) {
        coreIsActive = expansion.activated;
      } else {
        if (expansion.activated == true) {
          count++;
        }
      }
    }
    const updatedState: ExpansionState = {coreIsActive: coreIsActive, numberOfActiveExpansions: count};
    this.$log.debug('<-- updateCurrentState() =', JSON.stringify(updatedState));
    return updatedState;
  }

  isCoreSet(expansion: Expansion) {
    return expansion.id == 1;
  }

  disableAllExpansions() {
    this.$log.debug('--> disableAllExpansions().');
    for (const expansion of this.expansions) {
      const isCoreSet: boolean = (expansion.id == 1);
      if (!isCoreSet) {
        this.$log.debug('deactivating:', expansion.title);
        expansion.activated = false;
      }
    }
    this.$log.debug('<-- disableAllExpansions().');
  }

  setExpansionState(id: number, state: boolean) {
    let expansionToEnable: Expansion = this.expansions.find(o => o.id == id) as Expansion;
    expansionToEnable.activated = state;
  }

  setCoreSetState(newState: boolean) {
    this.expansions[0].activated = newState;
  }
}

</script>

<style scoped>

</style>
