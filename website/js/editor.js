loadData().then(() => {
	startAuthenticator();
});

document.getElementById("dialog-button-cancel").addEventListener("click", () => {
	hide('dialog');
});

document.getElementById("signout-link-mobile").addEventListener("click", () => {
	logout();
});

document.getElementById("signout-link").addEventListener("click", () => {
	logout();
});

document.getElementById("main-menu-toggle-btn").addEventListener("click", () => {
	toggleMenu();
});