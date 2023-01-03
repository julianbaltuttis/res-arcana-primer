<template>
  <v-dialog
      v-model="show"
      transition="dialog-bottom-transition"
      width="75vw"
  >
    <v-card>
      <div class="container">
        <!-- section: General -->
        <div class="row">
          <div class="twelve column">
            <h6>General</h6>
            <p>This app is a fan project for the board game Res Arcana by Sandcastle Games.
              This means that everything you see here is completely nonprofit.
              I do not own any rights to Res Arcana; these belong to
              <a href="http://www.sandcastle-games.com">Sandcastle Games</a>.
              In order to get any use out of this app, you will need a physical copy of Res Arcana.
              You can buy the game online or at a local brick-and-mortar board game store of your choosing.</p>
            <p>Please do, Res Arcana is amazing - or as Robert Heinlein would say: It beats the hell out of card
              games!</p>
          </div>
        </div>

        <!-- section: This App -->
        <div class="row">
          <div class="twelve columns">
            <h6>This App</h6>
            <p class="mb-5"> Res Arcana Primer is free of charge (as in "free lunch").
              It will never cost you a single dime to use.
              This app was made with love, <i>Vue</i> and <i>Vuetify</i>.
              It is written in <i>HTML</i>, <i>CSS</i> and <i>Javascript/Typescript</i>.
              The source code is hosted on <a href="https://gitlab.com/julianbaltuttis/res-arcana-primer">Gitlab</a>
              and uses an
              <a href="https://gitlab.com/julianbaltuttis/res-arcana-primer/-/raw/master/LICENSE">MIT license</a>,
              meaning it's free to use and modify as you see fit.
              The app itself lives on <a href="https://www.heroku.com">Heroku</a>.
              Note that Res Arcana Primer uses some cropped snippets of original artwork made for Res Arcana by Julien Delval.
            </p>
          </div>
        </div>


        <!-- section: Res Arcana -->
        <div class="row">
          <div class="one-third column">
            <p class="subheading">Programming:</p>
          </div>
          <div class="two-thirds column">
            <p>Julian Baltuttis</p>
          </div>
        </div>
        <div class="row">
          <div class="one-third column">
            <p class="subheading">Graphic Design:</p>
          </div>
          <div class="two-thirds column">
            <p>Julian Baltuttis</p>
          </div>
        </div>
        <div class="row">
          <div class="one-third column">
            <p class="subheading">Illustrations:</p>
          </div>
          <div class="two-thirds column">
            <p>Julien Delval</p>
          </div>
        </div>


      <!-- section: This App -->
      <div class="row">
        <div class="twelve columns">
          <h6>Res Arcana</h6>
          <p class="mb-5"> Credit where credit is due. The following fine people made Res Arcana:
          </p>
        </div>
      </div>


      <!-- section: Credits Res Arcana -->
      <div class="row">
        <div class="one-third column">
          <p class="subheading">Author:</p>
        </div>
        <div class="two-thirds column">
          <p>Tom Lehmann</p>
        </div>
      </div>
      <div class="row">
        <div class="one-third column">
          <p class="subheading">Illustrations:</p>
        </div>
        <div class="two-thirds column">
          <p>Julien Delval</p>
        </div>
      </div>
      <div class="row">
        <div class="one-third column">
          <p class="subheading">Graphic Design:</p>
        </div>
        <div class="two-thirds column">
          <p>Cyrille Daujean</p>
        </div>
      </div>
      <div class="row">
        <div class="one-third column">
          <p class="subheading">Production:</p>
        </div>
        <div class="two-thirds column">
          <p>Ted A. Marrioti</p>
        </div>
      </div>
        <div class="row">
          <div class="one-third column">
            <p class="subheading">Proofreading & Corrections:</p>
          </div>
          <div class="two-thirds column">
            <p>Antoine Prono, Céline Boutet</p>
          </div>
        </div>

      </div>
    </v-card>

  </v-dialog>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
  components: {},
})
export default class AboutPage extends Vue {
  @Prop() value!: boolean;

  get show() {
    return this.value;
  }

  set show(value) {
    this.$emit('input', value);
  }

  created() {
    this.$log.debug('--> created()');
  }
}
</script>

<style scoped>
.dialog {
  margin: 2em;
}

/* Typography
–––––––––––––––––––––––––––––––––––––––––––––––––– */
h1, h2, h3, h4, h5, h6 {
  margin-top: 1rem;
  margin-bottom: 0.8rem;
  font-weight: 300;
}

h1 {
  font-size: 4.0rem;
  line-height: 1.2;
  letter-spacing: -.1rem;
}

h2 {
  font-size: 3.6rem;
  line-height: 1.25;
  letter-spacing: -.1rem;
}

h3 {
  font-size: 3.0rem;
  line-height: 1.3;
  letter-spacing: -.1rem;
}

h4 {
  font-size: 2.4rem;
  line-height: 1.35;
  letter-spacing: -.08rem;
}

h5 {
  font-size: 1.8rem;
  line-height: 1.5;
  letter-spacing: -.05rem;
}

h6 {
  font-size: 1.5rem;
  line-height: 1.6;
  letter-spacing: 0;
}

/* Larger than phablet */
@media (min-width: 550px) {
  h1 {
    font-size: 5.0rem;
  }

  h2 {
    font-size: 4.2rem;
  }

  h3 {
    font-size: 3.6rem;
  }

  h4 {
    font-size: 3.0rem;
  }

  h5 {
    font-size: 2.4rem;
  }

  h6 {
    font-size: 1.5rem;
  }
}

.subheading {
  font-weight: bold;
  letter-spacing: 1px;
}


p {
  margin-top: 0;
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
