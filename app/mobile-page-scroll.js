export function planMobilePageSwitch(currentPage, targetPage, currentScrollY, positions) {
  const scrollY = Number.isFinite(currentScrollY) ? Math.max(0, currentScrollY) : 0;

  if (currentPage === targetPage) {
    return { changed: false, positions, targetScrollY: scrollY };
  }

  const rememberedTarget = positions[targetPage];
  return {
    changed: true,
    positions: { ...positions, [currentPage]: scrollY },
    targetScrollY: Number.isFinite(rememberedTarget) ? Math.max(0, rememberedTarget) : 0,
  };
}
