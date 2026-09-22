// In-memory (module-scope) flag: true once the Home preloader has played.
// Resets on an actual full page load/reload, but survives client-side
// route navigation within the same session, since the JS module isn't
// torn down when React Router swaps routes.
let homePreloaderPlayed = false;

export function hasHomePreloaderPlayed() {
  return homePreloaderPlayed;
}

export function markHomePreloaderPlayed() {
  homePreloaderPlayed = true;
}
