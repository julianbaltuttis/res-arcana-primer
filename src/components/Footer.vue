<template>
  <div>
    <v-footer
        color="black"
        padless
    >
      <v-row
          justify="center"
          no-gutters
      >
        <v-btn
            color="white"
            text
            rounded
            class="my-2"
            @click="showAboutPage()"
        >
          About
        </v-btn>
        <AboutPage v-model="aboutPageIsVisible"/>
      </v-row>
    </v-footer>

  </div>

</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import AboutPage from "@/components/dialogs/AboutPage.vue";

@Component({
  components: {
    AboutPage
  },
})
export default class Footer extends Vue {

  aboutPageIsVisible: boolean = false;

  created() {
    this.$log.debug('--> created()');
  }

  showAboutPage() {
    this.$log.debug('--> showAboutPage')
    this.aboutPageIsVisible = true;
  }
}
</script>

<style scoped>

</style>
