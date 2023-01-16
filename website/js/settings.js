loadData().then(() => {
	startAuthenticator();

	let user = JSON.parse(readData('user'));

	document.getElementById("settings-blog-lang").value = user.language;
	document.getElementById("settings-panel-theme").value = readData("theme");
	document.getElementById("settings-blog-theme").value = user.theme;
	document.getElementById("settings-session").value = readData('sessionDuration');
	document.getElementById("avatar").src = "https://cdn.bloggy.io/avatars/" + user.username;

	if(user.fa_enabled === true){
		document.getElementById("toggle-2fa-btn").innerText = "Disable";
		document.getElementById("toggle-2fa-btn").className = "dangerButton font-bold inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md focus:outline-none sm:text-sm";
	}else{
		document.getElementById("toggle-2fa-btn").innerText = "Enable";
		document.getElementById("toggle-2fa-btn").className = "successButton font-bold inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md focus:outline-none sm:text-sm";
	}

	if(user.yubico === null || user.yubico == ''){
		hide("remove-yubico-btn");
	}else{
		let yubico = user.yubico.split(";");
		if (yubico.length >= 5) hide("add-yubico-btn");

		let html = "";
		for (let i = 0; i < yubico.length; i++) {
			html += "<li class='passwordsBorderColor py-4 flex'><img class='h-10 w-10 rounded-full' src='/images/yubikey.png' alt='Yubico Key'><div class='ml-3'><p class='secondaryColor text-sm font-medium'>" + yubico[i] + "</p></div></li>";
		}
		document.getElementById('yubico-list').innerHTML = html;
	}
});

function saveAvatar(avatar) {
	changeDialog(10, "Uploading avatar...");
	show('dialog');

	Bloggy.saveAvatar(readData('username'), readData('token'), avatar).then(response => {

		if (typeof response['error'] === 'undefined') {
			changeDialog(2, "Server is unreachable!");
			return;
		}

		if (response['error'] != 0) {
			changeDialog(2, response.info);
			return;
		}

		changeDialog(7, "Avatar successfully changed.");

	}).catch(err => {
		switch(err){
			case 1002:
				changeDialog(2, "Username can only contain lowercase characters, numbers and hyphens. It also needs to start with lowercase character and be between 4 and 30 characters long.");
			break;
			case 1015:
				changeDialog(2, "Token is invalid. Please login first to get the token.");
			break;
			case 1029:
				changeDialog(2, "Avatar can't be bigger than 300kB. Please choose smaller image.");
			break;
			default:
				changeDialog(2, "Server is unreachable!");
			break;
		}
	});
}

function generatePages() {
	changeDialog(10, "Generating pages...");
	show('dialog');

	Bloggy.generatePages(readData('username'), readData('token')).then(response => {

		if (response['error'] != 0) {
			changeDialog(2, response.info);
			return;
		}

		changeDialog(7, "Pages successfully generated.");

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

function deleteAccount() {
	changeDialog(10, "Deleting account...");
	show('dialog');

	Bloggy.deleteAccount(readData('username'), readData('token')).then(response => {

		if (response['error'] != 0) {
			changeDialog(2, response.info);
			return;
		}

		logout();

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

function changeDialog(style, text) {
	switch (style) {
		case 1:
			//Delete account dialog
			showDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-red-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>";

			document.getElementById('dialog-title').innerText = "Delete account";
			document.getElementById('dialog-text').innerText = "Are you sure you want to delete your account? All of your data will be permanently removed from the server. This action can NOT be undone.";

			document.getElementById('dialog-button-cancel').style.display = 'initial';

			document.getElementById('dialog-button').className = "dangerButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Delete";
			document.getElementById('dialog-button').onclick = () => deleteAccount();
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
		case 3:
			//Enable 2fa dialog
			showDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'> <path stroke='none' d='M0 0h24v24H0z' fill='none'/> <path d='M7 16h-4l3.47 -4.66a2 2 0 1 0 -3.47 -1.54' /> <path d='M10 16v-8h4' /> <line x1='10' y1='12' x2='13' y2='12' /> <path d='M17 16v-6a2 2 0 0 1 4 0v6' /> <line x1='17' y1='13' x2='21' y2='13' /></svg>";

			document.getElementById('dialog-title').innerText = "Two-Factor Authentication (2FA)";
			document.getElementById('dialog-text').innerHTML = text;

			document.getElementById('dialog-button-cancel').style.display = 'none';

			document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = lang["okay"];
			document.getElementById('dialog-button').onclick = () => location.reload();
			break;
		case 4:
			//Enable 2fa confirmation dialog
			showDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'> <path stroke='none' d='M0 0h24v24H0z' fill='none'/> <path d='M7 16h-4l3.47 -4.66a2 2 0 1 0 -3.47 -1.54' /> <path d='M10 16v-8h4' /> <line x1='10' y1='12' x2='13' y2='12' /> <path d='M17 16v-6a2 2 0 0 1 4 0v6' /> <line x1='17' y1='13' x2='21' y2='13' /></svg>";

			document.getElementById('dialog-title').innerText = "Two-Factor Authentication (2FA)";
			document.getElementById('dialog-text').innerHTML = lang["enable_2fa_question"] + "<br/><br/>" + lang["totp_applications"] + " <b>Aegis</b>, <b>Google Auth</b>, <b>Authy</b>...";

			document.getElementById('dialog-button-cancel').style.display = 'initial';

			document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = lang["enable"];
			document.getElementById('dialog-button').onclick = () => enable2fa();
			break;
		case 5:
			//Disable 2fa confirmation dialog
			showDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'> <path stroke='none' d='M0 0h24v24H0z' fill='none'/> <path d='M7 16h-4l3.47 -4.66a2 2 0 1 0 -3.47 -1.54' /> <path d='M10 16v-8h4' /> <line x1='10' y1='12' x2='13' y2='12' /> <path d='M17 16v-6a2 2 0 0 1 4 0v6' /> <line x1='17' y1='13' x2='21' y2='13' /></svg>";

			document.getElementById('dialog-title').innerText = "Two-Factor Authentication (2FA)";
			document.getElementById('dialog-text').innerHTML = lang["disable_2fa_question"];

			document.getElementById('dialog-button-cancel').style.display = 'initial';

			document.getElementById('dialog-button').className = "dangerButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = lang["disable"];
			document.getElementById('dialog-button').onclick = () => disable2fa();
			break;
		case 6:
			//Add Yubico OTP confirmation dialog
			showDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='8' cy='15' r='4' /><line x1='10.85' y1='12.15' x2='19' y2='4' /><line x1='18' y1='5' x2='20' y2='7' /><line x1='15' y1='8' x2='17' y2='10' /></svg>";

			document.getElementById('dialog-title').innerText = "Yubico One-Time Password (Yubico OTP)";
			document.getElementById('dialog-text').innerHTML = lang["yubikey_insert_device"] + "<br/>" + lang["yubikey_focus_input"] + "<br/>" + lang["yubikey_press_button"] + "<br/><br/><label for='yubico-otp' class='sr-only'>OTP </label><input id='yubico-otp' name='yubico-otp' type='text' autocomplete='off' required class='appearance-none rounded-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:z-10 sm:text-sm' placeholder='OTP'></div>";

			document.getElementById('dialog-button-cancel').style.display = 'initial';

			document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = lang["add"];
			document.getElementById('dialog-button').onclick = () => addYubiKey(document.getElementById('yubico-otp').value);
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
		case 8:
			//Remove Yubico OTP confirmation dialog
			showDialogButtons();
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='8' cy='15' r='4' /><line x1='10.85' y1='12.15' x2='19' y2='4' /><line x1='18' y1='5' x2='20' y2='7' /><line x1='15' y1='8' x2='17' y2='10' /></svg>";

			document.getElementById('dialog-title').innerText = "Yubico One-Time Password (Yubico OTP)";
			document.getElementById('dialog-text').innerHTML = lang["yubikey_insert_device"] + "<br/>" + lang["yubikey_focus_input"] + "<br/>" + lang["yubikey_press_button"] + "<br/><br/><label for='yubico-otp' class='sr-only'>OTP </label><input id='yubico-otp' name='yubico-otp' type='text' autocomplete='off' required class='appearance-none rounded-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:z-10 sm:text-sm' placeholder='OTP'></div>";

			document.getElementById('dialog-button-cancel').style.display = 'initial';

			document.getElementById('dialog-button').className = "dangerButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Remove";
			document.getElementById('dialog-button').onclick = () => removeYubiKey(document.getElementById('yubico-otp').value);
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

document.getElementById("settings-panel-theme").addEventListener("change", () => {
	writeData('theme', document.getElementById("settings-panel-theme").value);
	document.getElementById("css-theme").href = "/css/themes/" + readData('theme') + ".css";
});

document.getElementById("settings-session").addEventListener("change", () => {
	writeData('sessionDuration', document.getElementById("settings-session").value);
	location.reload();
});

document.getElementById("delete-account-btn").addEventListener("click", () => {
	changeDialog(1);
	show('dialog');
});

document.getElementById("generate-pages-btn").addEventListener("click", () => {
	generatePages();
});

document.getElementById("upload-avatar").addEventListener("input", () => {
	let avatar = document.getElementById("upload-avatar").files[0];
	saveAvatar(avatar);
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