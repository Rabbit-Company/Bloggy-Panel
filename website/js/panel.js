loadData().then(() => {
	startAuthenticator();

	let posts = JSON.parse(readData('posts'));

	//Search
	let search = null;
	if(parms.get("search") != null && parms.get("search").length >= 1) {
		fhide('pagination');
		search = parms.get("search");
		document.getElementById("search").value = search;
		let tempArray = [];
		search = search.toLowerCase();
		for(let i = 0; i < posts.length; i++){
			const title = posts[i].title;
			const tag = posts[i].tag;
			const keywords = posts[i].keywords;

			if(title.includes(search) || tag.includes(search) || keywords.includes(search) || tempArray.push(posts[i]));
		}
		posts = tempArray;
	}
});

document.getElementById("search").addEventListener("keypress", (event) => {
	if (event.key !== "Enter") return;
	event.preventDefault();
	window.location.assign("?search=" + document.getElementById("search").value);
});

document.getElementById("page").addEventListener("keypress", (event) => {
	if (event.key !== "Enter") return;
	event.preventDefault();
	window.location.assign("?page=" + document.getElementById("page").value);
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