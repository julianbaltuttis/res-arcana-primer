<!--  Language Button component:
      Button that switches between display languages.
      Supports English and German. -->
<template>
  <div>
<!--    <v-btn @click="switchLanguage()"-->
<!--           elevation="2"-->
<!--           icon-->
<!--           large-->
<!--           dark-->
<!--    >-->
<!--      {{ label }}</v-btn>-->
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            elevation="2"
            icon
            large
            dark
            v-bind="attrs"
            v-on="on"
        >
          {{ currentLocale }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
            v-for="(item, index) in allLocales"
            :key="index"
            link
            @click="onNewLocaleSelected(item)"
        >
          <v-list-item-title>{{ getLanguageByLocale(item) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>

</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import i18n from "@/i18n";
import VueI18n from "vue-i18n";
import configuration from "@/config/configuration.json"
import LanguageMapping from "@/types/LanguageMapping";

@Component({
  components: {
  },
})
export default class Language extends Vue {
  label: string = i18n.locale.toString();
  allLocales: VueI18n.Locale[] = [i18n.availableLocales].pop() as Array<string>;
  currentLocale: VueI18n.Locale = this.$i18n.locale
  languageMapping: LanguageMapping = configuration.languageMapping;

  created() {
    this.$log.debug('--> created()');
    this.languageMapping = configuration.languageMapping;
    this.$log.debug("languageMapping:", JSON.stringify(this.languageMapping));
  }

  /**
   * Changes locale settings to next available locale.
   * Updates the label for the switch button accordingly.
   */
  switchLanguage() {
    this.$log.debug('--> switchLanguage()');
    const currentLocale: VueI18n.Locale = i18n.locale;
    this.$log.debug('current locale:', currentLocale);
    const nextLocale: VueI18n.Locale = this.getNextLocale(currentLocale);
    this.label = nextLocale.toString();
    this.setLocale(nextLocale);
  }

  /**
   * Getter to retrieve the next available locale.
   * @param currentLocale
   */
  getNextLocale(currentLocale: VueI18n.Locale ) {
    this.$log.debug('--> getNextLocale( current=', currentLocale, ')');
    let nextLocale: VueI18n.Locale = currentLocale;
    const availableLocales: VueI18n.Locale[] = [i18n.availableLocales].pop() as Array<string>;
    for (const availableLocale of availableLocales) {
      if (availableLocale != currentLocale) {
        nextLocale = availableLocale;
      }
    }
    this.$log.debug('<-- getNextLocale(). Return:', nextLocale);
    return nextLocale;
  }

  onNewLocaleSelected(newLocale: VueI18n.Locale) {
    this.$log.debug(newLocale,  'selected');
    this.setLocale(newLocale);
  }

  getLocaleByName(name: string) {
    return this.allLocales[name];
  }

  getLanguageByLocale(locale: VueI18n.Locale) {
    // return this.localeToLanguage.get(locale.toString());
    return this.languageMapping[locale];
  }

  /**
   * Sets current locale to given locale.
   * @param locale the locale that we want to switch to.
   */
  setLocale(locale: VueI18n.Locale) {
    this.$i18n.locale = locale;
    this.$log.debug('locale is now set to:', this.$i18n.locale);
    this.currentLocale = this.$i18n.locale;
    this.$router.push({
      params: { lang: locale }
    })
  }
}
</script>

<style scoped>
.locale-changer {
  max-width: 10vw;
}
</style>
