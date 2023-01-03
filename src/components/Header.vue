<!--  Header Component:
      Contains copy for title and subtitle.
      Contains buttons for switching language and choosing expansions. -->
<template>
  <div>
    <!--    title and subtitle-->
    <div class="flexbox-container row-of-elements">
      <div class="flexbox-item title" @click="routeTo('/')">
        <div class="white--text
                    font-weight-medium
                    text-h3
                    text-md-h1"
        >{{ title }}
        </div>
        <div class="white--text
                    d-none
                    d-sm-flex
                    text-sm-subtitle-2
                    text-lg-subtitle-1"
        >{{ $t('gui.subtitle') }}
        </div>
      </div>
      <!--      button for language and expansion selection-->
      <div class="flexbox-container">
        <div class="flexbox-item text-right">
          <Language/>
        </div>
        <div class="flexbox-item">
          <Options @switch-drawer-visibility="onSwitchDrawerVisibility"
                   :drawer="drawerIsVisible"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import Language from "@/components/buttons/Language.vue";
import Options from "@/components/buttons/Options.vue"

@Component({
  components: {
    Language,
    Options,
  },
})
export default class Header extends Vue {
  // data variables
  title: string = 'Res Arcana Primer';
  @Prop() drawerIsVisible!: boolean;

  @Emit('switch-drawer-visibility')
  onSwitchDrawerVisibility(showDrawer: boolean) {
    this.$log.debug('show drawer update received:', showDrawer);
    return showDrawer;
  }

  @Emit('reset-application-settings')
  routeTo(target: string) {
    this.$log.debug('--> routeTo(). target =', target);
    const currentPath: string = this.$route.path;
    this.$log.debug('current path:', currentPath);
    if (target !== currentPath) {
      this.$router.push(target).catch(error => {
        if (error.name != "NavigationDuplicated") {
          throw error;
        }
      });
    }
  }
}
</script>

<style scoped>
.flexbox-container {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* TODO this value needs some adjusting */
  min-height: 27vh;
}

.flexbox-item {
  /*margin: 5px;*/
  padding: 5px;
  cursor: pointer;
  /*border: 3px solid #333;*/
  /*background-color: goldenrod;*/
  /*width: 300px;*/
}

.title {
  margin-left: 10px;
}

.row-of-elements {
  /*outline: 2px solid black;*/
  width: 100%;
  /*top: -1.5em;*/
  /*top:-20%;*/
  /*position: relative;*/
  /*min-height: 5vw;*/
  /*padding-top: -100px;*/
  /*max-width: 20vw;*/
  /*background-color: red;*/
  background-repeat: no-repeat;
  background-image: url(../assets/splash-screen-04.png);
  background-size: cover;
  background-position: right bottom;
}
</style>
