import {CANVAS_DATA} from "./canvas_config.js";

const NO_OF_HIGH_SCORES = 10;
const HIGHSCORE_STORAGE_NAME = 'highscore-list';

export function loadHighscores() {
    return JSON.parse(localStorage.getItem(HIGHSCORE_STORAGE_NAME)!) ?? [];
    // const highScoreString = localStorage.getItem(HIGH_SCORES);
    //
    // if (typeof highScoreString === "string") {
    //    return JSON.parse(highScoreString) ;
    // }
    // else {
    //   return [];
    // }
}

export function checkHighScore(score: number) {
    const highscoreList = loadHighscores();
    // wenn es bereits 9 Eintraege in der Liste gibt, setze den neunten als niedrigsten, wenn nciht, setze niedrigsten = 0
    const lowestScore = highscoreList[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

    // ueberpruefen, ob der userscore hoeher als der neidrgiste ist.
    if (score > lowestScore) {
        return true;
    }
    return false;
}

export function saveHighScore(score: number, name: string) {
    const highScores = loadHighscores();

    const newScore = { score, name };

    // Highscore zur Liste hinzufügen
    highScores.push(newScore);

    // Highscoreliste absteigend sortieren
    highScores.sort((a: any, b: any) => b.score - a.score);

    // Liste auf 10 Eintrage beschneiden
    highScores.splice(NO_OF_HIGH_SCORES);

    // Speichern
    localStorage.setItem(HIGHSCORE_STORAGE_NAME, JSON.stringify(highScores));
}

export function showHighScores() {
    const highScores = loadHighscores();
    const highScoreList = document.getElementById(HIGHSCORE_STORAGE_NAME)!;
    CANVAS_DATA.DIV_HIGHSCORE.style.display = 'flex';
    highScoreList.innerHTML = highScores
        .map((score: any) => `<li>${score.score} pts - ${score.name}`)
        .join('');
}