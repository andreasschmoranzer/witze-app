export const LOCALSTORAGE_KEY = "jokes";

export function saveJokeToLocalstorage(savedJokes) {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(savedJokes));
}

export function getJokesFromLocalstorage() {
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];
}
