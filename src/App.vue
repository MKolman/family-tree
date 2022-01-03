<template>
  <h2>Družinsko drevo Kolmanov</h2>
  <FamilyTree :treeData="treeData" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import FamilyTree from "./components/FamilyTree.vue";
import { fetchAndDecryptFamily } from "@/lib/crypt";
import { formatFamily, FamilyTreeData } from "@/lib/formatTree";

@Options({
  components: {
    FamilyTree,
  },
})
export default class App extends Vue {
  treeData: FamilyTreeData | null = null;
  async mounted() {
    const url = new URL(location.href);
    const pwd = url.searchParams.get("pwd") || undefined;
    try {
      const family = await fetchAndDecryptFamily("/kolman.pb.aes", pwd);
      this.treeData = formatFamily(family);
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
