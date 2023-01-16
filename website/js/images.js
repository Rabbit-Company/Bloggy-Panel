loadData().then(() => {
	startAuthenticator();

	let images = JSON.parse(readData('images'));
	if(images == null){

	}

});

function getImages(){

}

document.getElementById("signout-link").addEventListener("click", () => {
	logout();
});

document.getElementById("signout-link-mobile").addEventListener("click", () => {
	logout();
});

document.getElementById("main-menu-toggle-btn").addEventListener("click", () => {
	toggleMenu();
});

document.getElementById("dialog-button-cancel").addEventListener("click", () => {
	hide('dialog');
});