const fixedMenuTypeOrder = new Map([
  ["lunchMenu", 0],
  ["dinnerMenu", 1],
  ["kidsMenu", 2],
  ["sundayMenu", 3],
]);

const fixedTitleOrder = new Map([
  ["lunch", 0],
  ["dinner", 1],
  ["kids menu", 2],
  ["sunday", 3],
  ["sunday menu", 3],
]);

function normalizedTitle(menu) {
  return String(menu?.title || "").trim().toLowerCase();
}

function menuOrder(menu) {
  return fixedMenuTypeOrder.get(menu?.menuType) ?? fixedTitleOrder.get(normalizedTitle(menu));
}

export function sortMenusForDisplay(menus = []) {
  return [...menus].sort((left, right) => {
    const leftOrder = menuOrder(left);
    const rightOrder = menuOrder(right);

    if (leftOrder !== undefined || rightOrder !== undefined) {
      return (leftOrder ?? 1000) - (rightOrder ?? 1000);
    }

    return String(left?.title || "").localeCompare(String(right?.title || ""), "en-GB", {
      sensitivity: "base",
    });
  });
}
