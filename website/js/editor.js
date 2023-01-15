loadData().then(() => {
	startAuthenticator();

	let posts = JSON.parse(readData('posts'));

	// Edit
	if(parms.get("edit") != null && parms.get("edit").length >= 5) {
		let id = parms.get("edit");
		for(let i = 0; i < posts.length; i++){
			if(posts[i].id !== id) continue;
			document.getElementById("id").value = id;
			document.getElementById("title").value = posts[i].title;
			document.getElementById("description").value = posts[i].description;
		}
	}

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