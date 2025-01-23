import "./styles.css";
import { setTheme } from "./setTheme";
// import odinImage from "./light-theme.png";
   
// document.body.appendChild(document.createElement("img").src = odinImage);

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.className = theme;
}

document.querySelector('.theme-toggle').addEventListener('click', setTheme);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const theme = e.matches ? 'dark' : 'light';
    document.documentElement.className = theme;
});

initializeTheme();