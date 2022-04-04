type MenuLink = Readonly<{
  type: "link";
  label: string;
  link: string;
}>;

type MenuDivider = Readonly<{
  type: "divider";
}>;

type SubMenu = Readonly<{
  type: "submenu";
  label: string;
  submenu?: ReadonlyArray<MenuLink | MenuDivider>;
}>;

type MainMenuData = ReadonlyArray<SubMenu | MenuLink>;

export function useMainMenu() {
  const { t } = useI18n();

  const menu: MainMenuData = [
    {
      type: "link",
      label: t("navigation.pages.home.label"),

      link: "/",
    },
    {
      type: "submenu",
      label: t("navigation.pages.planners.label"),
      submenu: [
        {
          type: "link",
          label: t("navigation.pages.planners.submenu.production.label"),

          link: "/planners/production",
        },
        {
          type: "link",
          label: t("navigation.pages.planners.submenu.power.label"),

          link: "/planners/power",
        },
      ],
    },
    {
      type: "link",
      label: t("navigation.pages.interactive-map.label"),
      link: "/interactive-map",
    },
    {
      type: "submenu",
      label: t("navigation.pages.game-resources.label"),
      submenu: [
        {
          type: "link",
          label: t("navigation.pages.game-resources.submenu.buildings.label"),
          link: "/buildings",
        },
        {
          type: "link",
          label: t(
            "navigation.pages.game-resources.submenu.architecture.label"
          ),
          link: "/architecture",
        },
        {
          type: "link",
          label: t("navigation.pages.game-resources.submenu.structures.label"),
          link: "/structures",
        },
        {
          type: "link",
          label: t("navigation.pages.game-resources.submenu.items.label"),
          link: "/items",
        },
        {
          type: "link",
          label: t("navigation.pages.game-resources.submenu.tools.label"),
          link: "/tools",
        },
        {
          type: "link",
          label: t("navigation.pages.game-resources.submenu.vehicles.label"),
          link: "/vehicles",
        },
        {
          type: "link",
          label: t("navigation.pages.game-resources.submenu.fauna.label"),
          link: "/fauna",
        },
        {
          type: "link",
          label: t("navigation.pages.game-resources.submenu.statuses.label"),
          link: "/statuses",
        },
        {
          type: "divider",
        },
        {
          type: "link",
          label: t("navigation.pages.game-resources.submenu.ficsmas.label"),
          link: "/ficsmas",
        },
      ],
    },
    {
      type: "submenu",
      label: t("navigation.pages.game-progression.label"),
      submenu: [
        {
          type: "link",
          label: t(
            "navigation.pages.game-progression.submenu.milestones.label"
          ),
          link: "/milestones",
        },
        {
          type: "link",
          label: t("navigation.pages.game-progression.submenu.mam.label"),
          link: "/mam",
        },
        {
          type: "link",
          label: t(
            "navigation.pages.game-progression.submenu.awesome-shop.label"
          ),
          link: "/awesome-shop",
        },
        {
          type: "link",
          label: t("navigation.pages.game-progression.submenu.tetromino.label"),
          link: "/tetromino-leader-board",
        },
      ],
    },
    {
      type: "link",
      label: t("navigation.pages.blueprints.label"),
      link: "/blueprints",
    },
    {
      type: "submenu",
      label: t("navigation.pages.workbench.label"),
      submenu: [
        {
          type: "link",
          label: t("navigation.pages.workbench.submenu.mods.label"),
          link: "/mods",
        },
        {
          type: "link",
          label: t("navigation.pages.workbench.submenu.color.label"),
          link: "/workbench/color",
        },
        {
          type: "link",
          label: t("navigation.pages.workbench.submenu.hard-drives.label"),
          link: "/hard-drives",
        },
        {
          type: "link",
          label: t("navigation.pages.workbench.submenu.balancers.label"),
          link: "/balancers",
        },
      ],
    },
  ];

  return menu;
}
