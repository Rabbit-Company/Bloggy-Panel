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

	for(let i = startFrom; i < stopOn; i++){
		let id = posts[i].id;

		document.getElementById("edit-post-" + id).addEventListener("click", () => {
			changeDialog(4, id);
			show('dialog');
		});

		document.getElementById("delete-post-" + id).addEventListener("click", () => {
			changeDialog(6, id);
			show('dialog');
		});
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

function changeDialog(style, text) {
	switch (style) {
		case 3:
			//Success dialog
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-green-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg>";

			document.getElementById('dialog-title').innerText = "SUCCESS";
			document.getElementById('dialog-text').innerText = text;
			document.getElementById('dialog-button-cancel').style.display = 'none';

			document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Okay";
			document.getElementById('dialog-button').onclick = () => refreshPosts();
			break;
		case 4:
			//Edit post dialog
			const e_data = text.split(";;;");

			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='8' cy='15' r='4' /><line x1='10.85' y1='12.15' x2='19' y2='4' /><line x1='18' y1='5' x2='20' y2='7' /><line x1='15' y1='8' x2='17' y2='10' /></svg>";

			document.getElementById('dialog-title').innerText = lang["edit_password"];

			document.getElementById('dialog-text').innerHTML = "<div class='rounded-md shadow-sm -space-y-px'><div><label for='website' class='sr-only'>Website</label><input id='website' name='website' type='text' autocomplete='website' value='" + e_data[1] + "' required class='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='" + lang["website"] + "'></div><div><label for='username' class='sr-only'>Username</label><input id='username' name='username' type='text' autocomplete='username' value='" + e_data[2] + "' required class='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='" + lang["username"] + "'></div>   <div><div class='flex rounded-md shadow-sm'><div class='relative flex items-stretch flex-grow focus-within:z-10'><input id='password' name='password' type='password' autocomplete='current-password' value='" + e_data[3] + "' required class='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-bl-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm' placeholder='" + lang["password"] + "'></div><button id='btn-password-generator' class='secondaryColor tertiaryBackgroundColor primaryBorderColor -ml-px relative inline-flex items-center space-x-2 px-4 py-2 border text-sm font-medium rounded-br-mdfocus:outline-none'><svg xmlns='http://www.w3.org/2000/svg' class='primaryStrokeColor' width='24' height='24' viewBox='0 0 24 24' stroke-width='1.5' stroke='#2c3e50' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><rect x='3' y='3' width='6' height='6' rx='1' /><rect x='15' y='15' width='6' height='6' rx='1' /><path d='M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3' /><path d='M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3' /></svg></button></div></div><h3 id='optionalNote' class='tertiaryColor text-lg leading-6 font-medium py-2'>Optional note</h3><textarea id='message' name='message' rows='3' class='max-w-lg p-2 shadow-sm block w-full sm:text-sm rounded-md focus:outline-none focus:z-10'>" + e_data[4] + "</textarea>";

			document.getElementById('dialog-button-cancel').style.display = 'initial';
			document.getElementById('optionalNote').innerText = lang["optional_note"];

			document.getElementById('dialog-button').className = "primaryButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = lang["change"];
			document.getElementById('dialog-button').onclick = () => editPassword(e_data[0]);

			document.getElementById('btn-password-generator').onclick = () => changeDialog(5, text);
			break;
		case 6:
			//Delete post dialog
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-red-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>";

			document.getElementById('dialog-title').innerText = "Delete post";
			document.getElementById('dialog-text').innerText = "Are you sure you want to delete your post? Your post will be permanently removed from the server. This action can NOT be undone.";

			document.getElementById('dialog-button-cancel').style.display = 'initial';

			document.getElementById('dialog-button').className = "dangerButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Delete";
			document.getElementById('dialog-button').onclick = () => deletePost(text);
			break;
		case 7:
			//Copied successfully
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-green-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg>";

			document.getElementById('dialog-title').innerText = "SUCCESS";
			document.getElementById('dialog-text').innerText = text;

			document.getElementById('dialog-button-cancel').style.display = 'none';

			document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Okay";
			document.getElementById('dialog-button').onclick = () => hide('dialog');
			break;
		case 8:
			//Loading...
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600 animate-spin' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M12 3a9 9 0 1 0 9 9'></path></svg>";

			document.getElementById('dialog-title').innerText = "PLEASE WAIT";
			document.getElementById('dialog-text').innerHTML = text;

			hideDialogButtons();
		break;
	}
}

function deletePost(id){
	changeDialog(8, "Deleting post...");

	Bloggy.deletePassword(readData('username'), readData('token'), id).then(response => {

		showDialogButtons();

		if (typeof response['error'] === 'undefined') {
			changeDialog(2, "Server is unreachable!");
			return;
		}

		if (response['error'] != 0) {
			changeDialog(2, response.info);
			return;
		}

		changeDialog(3, "Post deleted successfully.");

	}).catch(err => {
		showDialogButtons();
		switch(err){
			case 1002:
				changeDialog(2, "Username can only contain lowercase characters, numbers and hyphens. It also needs to start with lowercase character and be between 4 and 30 characters long.");
			break;
			case 1015:
				changeDialog(2, "Token is invalid. Please login again to get new token.");
			break;
			case 1018:
				changeDialog(2, "Post ID can only contain lower case characters, numbers and hypens. It also need to be between 5 and 100 characters long.");
			break;
			default:
				changeDialog(2, "Unknown error!");
			break;
		}
	});
}