import {CANVAS_DATA} from "../main.js";

const NO_OF_HIGH_SCORES = 10;
const HIGH_SCORES = 'highScores';

const highScoreString = localStorage.getItem(HIGH_SCORES);
let highScores: any;

function checkHighScore(score: number) {
    if (typeof highScoreString === "string") {
        highScores = JSON.parse(highScoreString) ;
    }
    else {
        highScores = [];
    }
    // wenn es bereits 9 Eintraege in der Liste gibt, setze den neunten als niedrigsten, wenn nciht, setze niedrigsten = 0
    const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

    // ueberpruefen, ob der userscore hoeher als der neidrgiste ist. wenn ja, dann zur liste hinzufuegen und liste anzeigen
    if (score > lowestScore) {
        saveHighScore(score, highScores);
        showHighScores();
    }
}
export function gameOver(userScore: number) {
    checkHighScore(userScore);
}
function saveHighScore(score: number, highScores: any) {
    const name = "feli"; //TODO: textinputfeld
    const newScore = { score, name };

    // Highscore zur Liste hinzufügen
    highScores.push(newScore);

    // Highscoreliste absteigend sortieren
    highScores.sort((a: any, b: any) => b.score - a.score);

    // Liste auf 10 Eintrage beschneiden
    highScores.splice(NO_OF_HIGH_SCORES);

    // Speichern
    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
}

export function showHighScores() {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)!) ?? [];
    const highScoreList = document.getElementById(HIGH_SCORES)!;
    CANVAS_DATA.DIV_HIGHSCORE.style.display = 'flex';
    highScoreList.innerHTML = highScores
        .map((score: any) => `<li>${score.score} pts - ${score.name}`)
        .join('');
}