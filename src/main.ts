import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import ECharts from "vue-echarts";
import { use } from "echarts/core";

// import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from "echarts/renderers";
import { TreeChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";

use([CanvasRenderer, TreeChart, TooltipComponent]);

createApp(App).component("v-chart", ECharts).mount("#app");
