loadData().then(() => {
	startAuthenticator();

	let posts = JSON.parse(readData('posts'));
	let user = JSON.parse(readData('user'));
	let images = JSON.parse(readData('images'));
	if(images == null){
		getImages();
	}else{
		fillImages(images);
		changePreviewPicture();
	}

	document.getElementById("preview_main_avatar").src = "https://cdn.bloggy.io/avatars/" + user.username;
	document.getElementById("preview_main_author").innerText = user.author;

	// Edit
	if(parms.get("edit") != null && parms.get("edit").length >= 5){
		let id = parms.get("edit");
		for(let i = 0; i < posts.length; i++){
			if(posts[i].id !== id) continue;
			document.getElementById("id").value = id;
			document.getElementById("title").value = posts[i].title;
			document.getElementById("description").value = posts[i].description;
			document.getElementById("category").value = posts[i].category;
			document.getElementById("language").value = posts[i].language;
			document.getElementById("tag").value = posts[i].tag;
			document.getElementById("keywords").value = posts[i].keywords;
			document.getElementById("content").value = posts[i].markdown;

			document.getElementById("id").readOnly = true;
			document.getElementById("btn-post").innerText = "Edit";

			document.getElementById("picture").value = posts[i].picture;
			document.getElementById("preview_main_title").innerText = posts[i].title;
			document.getElementById("preview_main_description").innerText = posts[i].description;
			document.getElementById("preview_main_tag").innerText = posts[i].tag;
			document.getElementById("preview_main_picture").src = `https://cdn.bloggy.io/images/${user.username}/${posts[i].picture}`;
			document.getElementById("preview_main_created").innerText = posts[i].created;
		}
	}else{
		document.getElementById("category").value = user.category;
		document.getElementById("language").value = user.language;

		document.getElementById("preview_main_created").innerText = new Date().toISOString().split('T')[0];
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

document.getElementById("btn-post").addEventListener("click", () => {
	if(parms.get("edit") != null && parms.get("edit").length >= 5){
		changeDialog(9);
	}else{
		changeDialog(6);
	}
	show('dialog');
});

document.getElementById("title").addEventListener("input", () => {
	if(document.getElementById("id").readOnly) return;
	let title = document.getElementById("title").value;
	let id = "";
	for(let i = 0; i < title.length; i++){
		if(title[i] == ' '){
			id += '-';
			continue;
		}
		if(/^([a-zA-Z0-9])$/.test(title[i])) id += title[i];
	}
	document.getElementById("id").value = id.toLowerCase();
});

document.getElementById("keywords").addEventListener("input", () => {
	let keywords = document.getElementById("keywords").value;
	keywords = keywords.replaceAll(' ', ',');
	document.getElementById("keywords").value = keywords.toLowerCase();
});

document.getElementById("title").addEventListener("input", () => {
	document.getElementById("preview_main_title").innerText = document.getElementById("title").value;
});

document.getElementById("description").addEventListener("input", () => {
	document.getElementById("preview_main_description").innerText = document.getElementById("description").value;
});

document.getElementById("tag").addEventListener("input", () => {
	document.getElementById("preview_main_tag").innerText = document.getElementById("tag").value;
});

document.getElementById("picture").addEventListener("input", () => {
	changePreviewPicture();
});

function changePreviewPicture(){
	let key = document.getElementById("picture").value;
	let picture = `https://cdn.bloggy.io/images/${readData('username')}/${key}`;
	if(key.length == 36) document.getElementById("preview_main_picture").src = picture;
}

document.getElementById("tabs-1-tab-1").addEventListener("click", () => {
	fhide("tabs-1-panel-2");
	fshow("tabs-1-panel-1", "block");
});

document.getElementById("tabs-1-tab-2").addEventListener("click", () => {
	fhide("tabs-1-panel-1");
	let user = JSON.parse(readData('user'));
	let content = document.getElementById("content").value;

	document.getElementById("post-title").innerText = user.title;
	document.getElementById("post-description").innerText = user.description;
	let social = "";
	if(typeof(user.social?.website) === 'string') social += "<a href='" + user.social?.website + "' target='_blank' class='text-gray-500 hover:text-gray-600'><span class='sr-only'>Website</span><svg class='h-6 w-6' stroke='currentColor' viewBox='0 0 24 24' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M19.5 7a8.998 8.998 0 0 0 -7.5 -4a8.991 8.991 0 0 0 -7.484 4'></path><path d='M11.5 3a16.989 16.989 0 0 0 -1.826 4'></path><path d='M12.5 3a16.989 16.989 0 0 1 1.828 4.004'></path><path d='M19.5 17a8.998 8.998 0 0 1 -7.5 4a8.991 8.991 0 0 1 -7.484 -4'></path><path d='M11.5 21a16.989 16.989 0 0 1 -1.826 -4'></path><path d='M12.5 21a16.989 16.989 0 0 0 1.828 -4.004'></path><path d='M2 10l1 4l1.5 -4l1.5 4l1 -4'></path><path d='M17 10l1 4l1.5 -4l1.5 4l1 -4'></path><path d='M9.5 10l1 4l1.5 -4l1.5 4l1 -4'></path></svg></a>";
	if(typeof(user.social?.discord) === 'string') social += "<a href='" + user.social?.discord + "' target='_blank' class='text-gray-500 hover:text-gray-600'><span class='sr-only'>Discord</span><svg class='h-6 w-6' stroke='currentColor' viewBox='0 0 24 24' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><circle cx='9' cy='12' r='1'></circle><circle cx='15' cy='12' r='1'></circle><path d='M7.5 7.5c3.5 -1 5.5 -1 9 0'></path><path d='M7 16.5c3.5 1 6.5 1 10 0'></path><path d='M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2.5'></path><path d='M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l1 2.5'></path></svg></a>";
	if(typeof(user.social?.twitter) === 'string') social += "<a href='" + user.social?.twitter + "' target='_blank' class='text-gray-500 hover:text-gray-600'><span class='sr-only'>Twitter</span><svg class='h-6 w-6' stroke='currentColor' viewBox='0 0 24 24' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z'></path></svg></a>";
	if(typeof(user.social?.github) === 'string') social += "<a href='" + user.social?.github + "' target='_blank' class='text-gray-500 hover:text-gray-600'><span class='sr-only'>Github</span><svg class='h-6 w-6' stroke='currentColor' viewBox='0 0 24 24' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5'></path></svg></a>";
	document.getElementById("post-social-media").innerHTML = social;

	let created = new Date().toISOString().split('T')[0];
	let readTime = Math.round(getWordCount(content) / 200);
	let avatar = "https://cdn.bloggy.io/avatars/" + user.username;

	document.getElementById("preview_main_read_time").innerText = readTime + " min read";

	let html = "<h1 class='post-title'>" + document.getElementById("title").value + "</h1>";
	html += "<div class='flex space-x-1 f16'><time datetime='" + created + "'>" + created + "</time><span aria-hidden='true'>&middot;</span><span>" + readTime + " min read</span></div>";
	html += "<div class='mt-6 flex items-center'><div class='flex-shrink-0'><a href='#'><span class='sr-only'>" + user.author + "</span><img class='h-12 w-12 rounded-full' src='" + avatar + "' alt='" + user.author + "'></a></div><div class='ml-3'><p class='f16 font-medium'><a href='#'>" + user.author + "</a></p></div></div>";

	html += marked.parse(content, {
		gfm: true,
		breaks: true,
		sanitizer: DOMPurify.sanitize
	});

	document.getElementById('post').innerHTML = html;
	fshow("tabs-1-panel-2", "block");
});

function changeDialog(style, text) {
	switch (style) {
		case 2:
			//Error dialog
			showDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-red-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>";

			document.getElementById('dialog-title').innerText = "ERROR";
			document.getElementById('dialog-text').innerText = text;

			document.getElementById('dialog-button-cancel').style.display = 'none';

			document.getElementById('dialog-button').className = "dangerButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Okay";
			document.getElementById('dialog-button').onclick = () => hide("dialog");
			break;
		case 3:
			//Success dialog
			showDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-green-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg>";

			document.getElementById('dialog-title').innerText = "SUCCESS";
			document.getElementById('dialog-text').innerText = text;
			document.getElementById('dialog-button-cancel').style.display = 'none';

			document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Okay";
			document.getElementById('dialog-button').onclick = () => refreshPosts();
			break;
		case 6:
			//Create post dialog
			showDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-green-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg>";

			document.getElementById('dialog-title').innerText = "Create post";
			document.getElementById('dialog-text').innerText = "Are you sure you want to create your post?";

			document.getElementById('dialog-button-cancel').style.display = 'initial';

			document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Create";
			document.getElementById('dialog-button').onclick = () => createPost();
			break;
		case 7:
			//Copied successfully
			showDialogButtons();
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
			hideDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600 animate-spin' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M12 3a9 9 0 1 0 9 9'></path></svg>";

			document.getElementById('dialog-title').innerText = "PLEASE WAIT";
			document.getElementById('dialog-text').innerHTML = text;
			break;
		case 9:
			//Edit post dialog
			showDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-green-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg>";

			document.getElementById('dialog-title').innerText = "Edit post";
			document.getElementById('dialog-text').innerText = "Are you sure you want to edit your post?";

			document.getElementById('dialog-button-cancel').style.display = 'initial';

			document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Edit";
			document.getElementById('dialog-button').onclick = () => editPost();
		break;
	}
}

function createPost(){

	let id = document.getElementById("id").value;
	let title = document.getElementById("title").value;
	let description = document.getElementById("description").value;
	let picture = document.getElementById("picture").value;
	let markdown = document.getElementById("content").value;
	let category = document.getElementById("category").value;
	let language = document.getElementById("language").value;
	let tag = document.getElementById("tag").value;
	let keywords = document.getElementById("keywords").value;

	changeDialog(8, "Creating post...");

	Bloggy.createPost(readData('username'), readData('token'), id, title, description, picture, markdown, category, language, tag, keywords).then(response => {

		if (typeof response['error'] === 'undefined') {
			changeDialog(2, "Server is unreachable!");
			return;
		}

		if (response['error'] != 0) {
			changeDialog(2, response.info);
			return;
		}

		changeDialog(3, "Post created successfully.");

	}).catch(err => {
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
			case 1019:
				changeDialog(2, "Title needs to be between 5 and 100 characters long.");
			break;
			case 1020:
				changeDialog(2, "Description needs to be between 30 and 300 characters long.");
			break;
			case 1021:
				changeDialog(2, "Picture needs to be between 5 and 500 characters long.");
			break;
			case 1022:
				changeDialog(2, "Post needs to be between 150 and 10000 words long.");
			break;
			case 1012:
				changeDialog(2, "Category is invalid.");
			break;
			case 1013:
				changeDialog(2, "Language is invalid. Please use ISO 639-1.");
			break;
			case 1023:
				changeDialog(2, "Tag needs to be between 3 and 30 characters long.");
			break;
			case 1024:
				changeDialog(2, "You need to have from 3 to 20 keywords. Keywords needs to be separated with comma and string can't be longer than 255 characters.");
			break;
			default:
				changeDialog(2, "Unknown error!");
			break;
		}
	});
}

function editPost(){

	let id = document.getElementById("id").value;
	let title = document.getElementById("title").value;
	let description = document.getElementById("description").value;
	let picture = document.getElementById("picture").value;
	let markdown = document.getElementById("content").value;
	let category = document.getElementById("category").value;
	let language = document.getElementById("language").value;
	let tag = document.getElementById("tag").value;
	let keywords = document.getElementById("keywords").value;

	changeDialog(8, "Editing post...");

	Bloggy.editPost(readData('username'), readData('token'), id, title, description, picture, markdown, category, language, tag, keywords).then(response => {

		if (typeof response['error'] === 'undefined') {
			changeDialog(2, "Server is unreachable!");
			return;
		}

		if (response['error'] != 0) {
			changeDialog(2, response.info);
			return;
		}

		changeDialog(3, "Post edited successfully.");

	}).catch(err => {
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
			case 1019:
				changeDialog(2, "Title needs to be between 5 and 100 characters long.");
			break;
			case 1020:
				changeDialog(2, "Description needs to be between 30 and 300 characters long.");
			break;
			case 1021:
				changeDialog(2, "Picture needs to be between 5 and 500 characters long.");
			break;
			case 1022:
				changeDialog(2, "Post needs to be between 150 and 10000 words long.");
			break;
			case 1012:
				changeDialog(2, "Category is invalid.");
			break;
			case 1013:
				changeDialog(2, "Language is invalid. Please use ISO 639-1.");
			break;
			case 1023:
				changeDialog(2, "Tag needs to be between 3 and 30 characters long.");
			break;
			case 1024:
				changeDialog(2, "You need to have from 3 to 20 keywords. Keywords needs to be separated with comma and string can't be longer than 255 characters.");
			break;
			default:
				changeDialog(2, "Unknown error!");
			break;
		}
	});
}

function fillImages(images){
	for(let i = 0; i < images.length; i++){
		let option = document.createElement("option");
		option.setAttribute('value', images[i].key);

		let optionText = document.createTextNode(images[i].key);
		option.appendChild(optionText);

		document.getElementById("picture").appendChild(option);
	}
}

function getImages(){
	changeDialog(8, "Loading images...");
	show('dialog');

	Bloggy.getImages(readData('username'), readData('token')).then(response => {

		if (typeof response['error'] === 'undefined') {
			changeDialog(2, "Server is unreachable!");
			return;
		}

		if (response['error'] != 0) {
			changeDialog(2, response.info);
			return;
		}

		let images = response.images.sort(function(a,b){
			return new Date(b.uploaded) - new Date(a.uploaded);
		});

		writeData('images', JSON.stringify(images));
		fillImages(images);
		changePreviewPicture();
		hide('dialog');

	}).catch(err => {
		switch(err){
			case 1002:
				changeDialog(2, "Username can only contain lowercase characters, numbers and hyphens. It also needs to start with lowercase character and be between 4 and 30 characters long.");
			break;
			case 1015:
				changeDialog(2, "Token is invalid. Please login first to get the token.");
			break;
			default:
				changeDialog(2, "Server is unreachable!");
			break;
		}
	});
}