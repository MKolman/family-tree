<template>
  <button class="treeType" @click="radial = !radial">
    Vrsta drevesa:
    <span v-if="radial">↻</span>
    <span v-else>⇉</span>
  </button>

  <span class="depth">
    <button @click="depth -= depth >= 0 ? 1 : 0"><span>-</span></button>
    <select v-model="depth">
      <option v-for="d in selectDepths" :key="d" :value="d">
        {{ getDepthName(d) }}
      </option>
    </select>
    <button @click="depth += 1"><span>+</span></button>
  </span>

  <v-chart
    :key="radial"
    v-if="treeData !== null"
    :option="options"
    class="chrt"
  ></v-chart>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    treeData: Object,
  },
})
export default class FamilyTree extends Vue {
  treeData!: any;
  radial = false;
  depth = 1;

  get options(): any {
    const result: any = {
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove",
      },
      series: [
        {
          type: "tree",
          data: [this.treeData],
          symbol: "emptyCircle",
          symbolSize: 7,
          textSize: 20,
          initialTreeDepth: this.depth,
          animationDurationUpdate: 750,
          emphasis: {
            focus: "descendant",
          },
          label: {
            fontSize: "20",
          },
        },
      ],
    };
    if (this.radial) {
      result.series[0].layout = "radial";
    } else {
      result.series[0].orient = "LR";
      result.series[0].layout = "orthogonal";
    }
    return result;
  }

  get selectDepths(): number[] {
    const result = [-1, 0, 1, 2, 3];
    if (this.depth > 3) {
      result.push(this.depth);
    }
    return result;
  }

  getDepthName(depth: number): string {
    if (depth == -1) {
      return "Vse";
    }
    if (depth < 3) {
      return ["Oce in mati", "Otroci", "Vnuki"][depth];
    }
    return "Pra-" + "pra-".repeat(depth - 3) + "vnuki";
  }
}
</script>

<style lang="scss">
.chrt {
  min-width: 500px;
  min-height: 500px;
  max-width: 100vw;
  max-height: 100vh;
  margin-left: auto;
  margin-right: auto;
  aspect-ratio: 1;
}

.treeType {
  height: 3rem;
  margin-right: 1em;
  cursor: pointer;
  font-size: larger;
  span {
    vertical-align: middle;
    font-size: 2em;
  }
}
.depth {
  button {
    font-size: 1.5em;
    height: 3rem;
    vertical-align: middle;
    span {
      vertical-align: middle;
    }
  }
  select {
    font-size: larger;
    vertical-align: middle;
    height: 3rem;
  }
}
</style>
