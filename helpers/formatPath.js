export function formatPathname(pathname) {
  const trimmedPath = pathname.charAt(0) === "/" ? pathname.slice(1) : pathname;

  const path = trimmedPath.split("/").filter((segment) => segment !== "");

  const moduleName = path[0] || "";

  const formattedPhrase = moduleName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return formattedPhrase;
}
