import { fetchJoke } from "./fetch_api";
import {
  getJokesFromLocalstorage,
  saveJokeToLocalstorage,
} from "./storing_local_storage";
import "../styles/styles.scss";
import "../styles/_variables.scss";

const generateNewJokeButton = document.querySelector(".current-joke__new-joke");
const saveJokeButton = document.querySelector(".current-joke__save-joke");
const deleteJokeButton = document.querySelector(".saved-joke__action");
const lightModeButton = document.querySelector(".design-mode__light");
const darkModeButton = document.querySelector(".design-mode__dark");

const rootEl = document.documentElement;
const jokeParagraphEl = document.querySelector(".current-joke__text");
const savedJokeListEl = document.querySelector(".saved-jokes__list");
const currentJokeBoxEl = document.querySelector(".current-joke");

generateNewJokeButton.addEventListener("click", () => showRandomJoke());
saveJokeButton.addEventListener("click", () => saveJoke());
lightModeButton.addEventListener("click", () => lightMode());
darkModeButton.addEventListener("click", () => darkMode());

displaySavedJokes();
darkMode();

function applyEventListener() {
  const deleteJokeButtonEls = document.querySelectorAll(".saved-joke__action");

  deleteJokeButtonEls.forEach((item) => {
    item.addEventListener("click", () =>
      deleteJoke(item.getAttribute("data-id")),
    );
  });
}

async function showRandomJoke() {
  saveJokeButton.style.display = "flex";

  const randomJoke = await fetchJoke();
  jokeParagraphEl.innerText = randomJoke;
}

export function saveJoke() {
  const generatedJoke = jokeParagraphEl.innerText;

  let savedJokes = getJokesFromLocalstorage();

  if (savedJokes.find((joke) => joke.text === generatedJoke)) {
    alert("Dieser Witz wurde bereits gespeichert!");
    return;
  }

  const jokeToSave = {
    id: getNextId(),
    text: generatedJoke,
  };

  savedJokes.push(jokeToSave);

  saveJokeToLocalstorage(savedJokes);
  displaySavedJokes();
}

function displaySavedJokes() {
  const jokes = getJokesFromLocalstorage();

  if (jokes.length === 0 || jokes === undefined) {
    savedJokeListEl.innerHTML = "<em>Es wurde kein Witz gespeichert!</em>";
    return;
  }

  const reversedJokes = jokes.reverse();

  let html = "";

  reversedJokes.forEach((joke) => {
    html += `<div class="saved-joke">
                <p class="saved-joke__text">
                    ${joke.text}
                </p>
                <div class="saved-joke__action" data-id="${joke.id}" data-text="${joke.text}">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="saved-joke__delete-icon"
                    >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
                    />
                    </svg>
                </div>
              </div>`;
  });

  savedJokeListEl.innerHTML = html;

  applyEventListener();
}

function deleteJoke(id) {
  const selectedJokeEl = document.querySelector(
    `.saved-joke__action[data-id="${id}"]`,
  );

  const jokes = getJokesFromLocalstorage();

  const selectedJokeIndex = jokes.findIndex(
    (joke) => joke.id === Number(selectedJokeEl.dataset.id),
  );

  jokes.splice(selectedJokeIndex, 1);

  saveJokeToLocalstorage(jokes);
  displaySavedJokes();
}

function lightMode() {
  darkModeButton.classList.remove("design-mode__theme--selected");
  lightModeButton.classList.add("design-mode__theme--selected");

  rootEl.classList.add("light-theme");
}

function darkMode() {
  lightModeButton.classList.remove("design-mode__theme--selected");
  darkModeButton.classList.add("design-mode__theme--selected");

  rootEl.classList.remove("light-theme");
}

function getNextId() {
  let jokeId = 1;

  const savedJokes = getJokesFromLocalstorage();

  console.log(savedJokes);

  for (let i = 0; i < savedJokes.length + 1; i++) {
    const findCurrentJokeId = savedJokes.find((item) => item.id === jokeId);
    if (findCurrentJokeId === undefined) {
      break;
    } else {
      jokeId++;
    }
  }
  console.log(jokeId);
  return jokeId;
}
