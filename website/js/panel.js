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

			if(title.includes(search) || tag.includes(search) || keywords.includes(search)) tempArray.push(posts[i]);
		}
		posts = tempArray;
	}

	let amount = posts.length;
	document.getElementById("stats-total-posts").innerText = amount;

	//Page settings
	let page = (parms.get("page") != null && IsNumeric(parms.get("page")) && parseFloat(parms.get("page")) >= 1) ? parseFloat(parms.get("page")) : 1;
	let limit = (search == null) ? 25 : amount;
	let startFrom = (page - 1) * limit;
	let totalPages = Math.ceil(amount / limit);
	if(totalPages != 0 && page > totalPages) window.location.href = 'panel.html?page=' + totalPages;
	let stopOn = (startFrom+limit > amount) ? amount : startFrom+limit;

	//Pagination
	if(search == null && totalPages > 1) fshow('pagination', 'block');
	document.getElementById("label-startFrom").innerText = startFrom+1;
	document.getElementById("label-stopOn").innerText = stopOn;
	document.getElementById("label-totalPasswords").innerText = amount;

	if(page == 1) fhide('pagination-left');
	if(page == totalPages) fhide('pagination-right');

	document.getElementById("pagination-left").href = "?page=" + (page-1);
	document.getElementById("page").value = page;
	document.getElementById("page").max = totalPages;
	document.getElementById("pagination-right").href = "?page=" + (page+1);

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