import Vue from "vue";
import Router from "vue-router";
import analysis from "@/views/analysis/Index";
import layout from "@/components/layout/Index";
import MapDown from "@/views/mapDown/Index";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/analysis",
      component: layout,
      children: [
        {
          path: "/analysis",
          name: "analysis",
          component: analysis
        },
        {
          path: "/mapDown",
          name: "mapDown",
          component: MapDown
        }
      ]
    }
  ]
});
