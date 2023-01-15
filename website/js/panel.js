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

	let html_posts = "";
	for(let i = startFrom; i < stopOn; i++){
		let id = posts[i].id;
		let username = posts[i].username;
		let picture = (posts[i].picture.startsWith("http")) ? posts[i].picture : "https://cdn.bloggy.io/posts/" + username + "/" + posts[i].picture;

		html_posts += "<tr class='passwordsBorderColor'><td class='px-8 py-4 max-w-xs overflow-hidden'><div class='flex items-center'><div class='flex-shrink-0 hidden md:block'>";
		html_posts += "<img class='h-48 w-full object-cover' src='" + picture + "' alt=''>";
		html_posts += "</div><div class='ml-4'><div class='tertiaryColor text-md md:text-lg font-medium max-w-[14rem] sm:max-w-[16rem] md:max-w-[24rem] lg:max-w-[34rem] xl:max-w-[50rem] 2xl:max-w-[54rem] overflow-hidden text-ellipsis'>";
		// Title
		html_posts += `<a href='https://bloggy.io/creator/${username}/${id}' target='_blank'>${posts[i].title}</a>`;
		html_posts += "</div><div class='secondaryColor hidden md:block text-sm max-w-[14rem] sm:max-w-[16rem] md:max-w-[24rem] lg:max-w-[34rem] xl:max-w-[50rem] 2xl:max-w-[54rem] overflow-hidden text-ellipsis'>";
		// Description
		html_posts += posts[i].description;
		html_posts += "</div></div></div></td><td class='px-1 py-4 w-16 whitespace-nowrap'>";
		//Edit Post
		html_posts += "<span id='edit-post-" + id + "' role='button'>";
		html_posts += "<svg class='m-auto' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' stroke-width='1.5' stroke='#2c3e50' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3' /><path d='M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3' /><line x1='16' y1='5' x2='19' y2='8' /></svg></span></td><td class='px-1 py-4 w-16 whitespace-nowrap'>";
		//Delete Post
		html_posts += "<span id='delete-post-" + id + "' role='button'>";
		html_posts += "<svg class='m-auto' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' stroke-width='1.5' stroke='#2c3e50' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M19 19h-11l-4 -4a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9 9' /><line x1='18' y1='12.3' x2='11.7' y2='6' /></svg></span></td></tr>";
	}
	document.getElementById("table-data").innerHTML = html_posts;
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

document.getElementById("create-post-btn").addEventListener("click", () => {
	window.location.href = 'editor.html';
})

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