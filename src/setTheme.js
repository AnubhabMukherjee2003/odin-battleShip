function setTheme(e) {
    const root = document.documentElement;
    const newTheme = root.className === 'dark' ? 'light' : 'dark';
    root.className = newTheme;
    localStorage.setItem('theme', newTheme);
}

export { setTheme };