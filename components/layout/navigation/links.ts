import {
  navigationLinks,
  dropdownLinks,
  moreLinks,
} from "@/data/navigation";

// Re-exported so navigation code has a single import path for its link data.
export { navigationLinks };

/**
 * Sections the homepage scroll-spy watches.
 *
 * Pages that live at their own route are not homepage sections, and the two
 * extra ids (`sermons`, `gallery`) are anchors that exist on the page without
 * being top-level nav entries.
 */
export const sectionLinkIds = [
  ...navigationLinks
    .map((link) => link.id)
    .filter(
      (id) =>
        id !== "giving" &&
        id !== "pastors" &&
        id !== "ministries" &&
        id !== "welfare" &&
        id !== "crusade"
    ),
  "sermons",
  "gallery",
];

export const topLevelLinks = navigationLinks.filter((link) => link.id !== "giving");

export const dropdownMenuLinks = dropdownLinks;
export const moreMenuLinks = moreLinks;

/**
 * On the homepage the scroll-spy decides the active item; on every other route
 * the current page is whichever link's href matches the pathname. The old code
 * left "home" selected everywhere, so /live, /prayer and the rest all showed
 * Home as the current page.
 */
export function resolveActiveNav(pathname: string, homeSection: string) {
  const isHome = pathname === "/";
  const routeLinkId = isHome
    ? undefined
    : [...navigationLinks, ...moreLinks, ...dropdownLinks].find(
        (link) => link.href === pathname
      )?.id;

  const activeId = isHome ? homeSection : routeLinkId ?? "";
  return {
    isHome,
    activeId,
    moreIsActive: moreLinks.some((link) => link.id === activeId),
  };
}
