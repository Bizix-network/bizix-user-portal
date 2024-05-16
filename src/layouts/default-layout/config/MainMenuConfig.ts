import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "Dashboard",
        route: "/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "Catalog Aplicații",
        route: "/catalog",
        keenthemesIcon: "apps",
        bootstrapIcon: "bi-list",
      },
      {
        heading: "Abonamente",
        route: "/subscriptions",
        keenthemesIcon: "basket",
        bootstrapIcon: "bi-cart",
      },
      {
        heading: "Profil",
        route: "/profile",
        keenthemesIcon: "profile-circle",
        bootstrapIcon: "bi-person",
        sub: [
          {
            heading: "Overview",
            route: "/profile/overview",
          },
          {
            heading: "Setări",
            route: "/profile/settings",
          },
        ],
      },
      {
        heading: "Suport",
        route: "/support",
        keenthemesIcon: "help",
        bootstrapIcon: "bi-question-circle",
      },
    ],
  },
];

export default MainMenuConfig;
