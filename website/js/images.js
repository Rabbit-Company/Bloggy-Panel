loadData().then(() => {
	startAuthenticator();

	let images = JSON.parse(readData('images'));
	if(images == null){
		getImages();
	}else{
		renderImages(images);
	}

});

function renderImages(images){
	let html = "";
	let username = readData('username');

	for(let i = 0; i < images.length; i++){
		html += `<li class="relative"><div class="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100">
		<img src="https://cdn.bloggy.io/images/${username}/${images[i].key}" class="pointer-events-none object-cover group-hover:opacity-75">
		<button id="image-${images[i].key}" type="button" class="absolute inset-0 focus:outline-none"></button></div>
		<p class="tertiaryColor pointer-events-none mt-2 block truncate text-sm font-medium">${images[i].key}</p><div class="secondaryColor pointer-events-none flex space-x-1 text-sm">
		<time>${new Date(images[i].uploaded).toISOString().split('T')[0]}</time><span aria-hidden="true">·</span><span>${Math.round(images[i].size / 1000)} kB</span></div></li>`;
	}

	/*
	let keys = Object.keys(images);
	keys.forEach(key => {
		html += `<li class="relative"><div class="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100">
		<img src="https://cdn.bloggy.io/images/${username}/${key}" class="pointer-events-none object-cover group-hover:opacity-75">
		<button id="image-${key}" type="button" class="absolute inset-0 focus:outline-none"></button></div>
		<p class="tertiaryColor pointer-events-none mt-2 block truncate text-sm font-medium">${key}</p><div class="secondaryColor pointer-events-none flex space-x-1 text-sm">
		<time>${new Date(images[key].uploaded).toISOString().split('T')[0]}</time><span aria-hidden="true">·</span><span>${Math.round(images[key].size / 1000)} kB</span></div></li>`;
	});
	*/
	document.getElementById("image-list").innerHTML = html;

	for(let i = 0; i < images.length; i++){
		document.getElementById(`image-${images[i].key}`).addEventListener('click', () => {
			changeDialog(1, images[i].key);
			show('dialog');
		});
	}
	/*
	keys.forEach(key => {
		document.getElementById(`image-${key}`).addEventListener('click', () => {
			changeDialog(1, key);
			show('dialog');
		});
	});
	*/
}

function getImages(){
	changeDialog(10, "Loading images...");
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
		renderImages(images);
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

function deleteImage(key){
	changeDialog(10, "Deleting image...");
	show('dialog');

	Bloggy.deleteImage(readData('username'), readData('token'), key).then(response => {

		if (typeof response['error'] === 'undefined') {
			changeDialog(2, "Server is unreachable!");
			return;
		}

		if (response['error'] != 0) {
			changeDialog(2, response.info);
			return;
		}

		hide('dialog');
		getImages();

	}).catch(err => {
		switch(err){
			case 1002:
				changeDialog(2, "Username can only contain lowercase characters, numbers and hyphens. It also needs to start with lowercase character and be between 4 and 30 characters long.");
			break;
			case 1015:
				changeDialog(2, "Token is invalid. Please login first to get the token.");
			break;
			case 1030:
				changeDialog(2, "Image name is invalid.");
			break;
			default:
				changeDialog(2, "Server is unreachable!");
			break;
		}
	});
}

function saveImage(image) {
	changeDialog(10, "Uploading image...");
	show('dialog');

	Bloggy.saveImage(readData('username'), readData('token'), image).then(response => {

		if (typeof response['error'] === 'undefined') {
			changeDialog(2, "Server is unreachable!");
			return;
		}

		if (response['error'] != 0) {
			changeDialog(2, response.info);
			return;
		}

		hide('dialog');
		getImages();

	}).catch(err => {
		switch(err){
			case 1002:
				changeDialog(2, "Username can only contain lowercase characters, numbers and hyphens. It also needs to start with lowercase character and be between 4 and 30 characters long.");
			break;
			case 1015:
				changeDialog(2, "Token is invalid. Please login first to get the token.");
			break;
			case 1029:
				changeDialog(2, "Image can't be bigger than 500kB. Please choose smaller image.");
			break;
			default:
				changeDialog(2, "Server is unreachable!");
			break;
		}
	});
}

function changeDialog(style, text) {
	switch (style) {
		case 1:
			//Delete image dialog
			showDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-red-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>";

			document.getElementById('dialog-title').innerText = "Delete image";
			document.getElementById('dialog-text').innerText = "Are you sure you want to delete this image? This action can NOT be undone.";

			document.getElementById('dialog-button-cancel').style.display = 'initial';

			document.getElementById('dialog-button').className = "dangerButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Delete";
			document.getElementById('dialog-button').onclick = () => deleteImage(text);
			break;
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
		case 7:
			//Success dialog
			showDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='8' cy='15' r='4' /><line x1='10.85' y1='12.15' x2='19' y2='4' /><line x1='18' y1='5' x2='20' y2='7' /><line x1='15' y1='8' x2='17' y2='10' /></svg>";

			document.getElementById('dialog-title').innerText = "SUCCESS";
			document.getElementById('dialog-text').innerHTML = text;

			document.getElementById('dialog-button-cancel').style.display = 'none';

			document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Okay";
			document.getElementById('dialog-button').onclick = () => location.reload();
			break;
		case 10:
			//Loading...
			hideDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600 animate-spin' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M12 3a9 9 0 1 0 9 9'></path></svg>";

			document.getElementById('dialog-title').innerText = "PLEASE WAIT";
			document.getElementById('dialog-text').innerHTML = text;
			break;
	}
}

document.getElementById("upload-image").addEventListener("input", () => {
	let image = document.getElementById("upload-image").files[0];
	saveImage(image);
});

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