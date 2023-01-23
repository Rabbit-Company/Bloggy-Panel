loadData().then(() => {
	if(isSessionValid()) window.location.href = 'panel.html';
	if(readData('username') !== null && typeof(readData('username')) !== 'undefined') document.getElementById('username').value = readData('username');
});

document.getElementById("login_form").addEventListener("submit", e => {
	e.preventDefault();
	login_check();
});

document.getElementById("btn_signup").addEventListener("click", () => {
	window.location.href = "register.html";
});

function changeDialog(style, text){
	switch(style){
		case 1:
			//Error dialog
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-red-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>";

			document.getElementById('dialog-title').innerText = "Error";
			document.getElementById('dialog-text').innerText = text;

			document.getElementById('dialog-button-cancel').style.display = 'none';

			document.getElementById('dialog-button').className = "dangerButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
			document.getElementById('dialog-button').innerText = "Okay";
			document.getElementById('dialog-button').onclick = () => hide("dialog");
		break;
		case 4:
			//Loading...
			document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
			document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600 animate-spin' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M12 3a9 9 0 1 0 9 9'></path></svg>";

			document.getElementById('dialog-title').innerText = "Please wait";
			document.getElementById('dialog-text').innerHTML = text;

			hideDialogButtons();
		break;
	}
}

function login_check(){
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	const otp = document.getElementById("otp").value.replace(/\s/g, '');

	if(PasswordEntropy.calculate(password) < 75){
		changeDialog(1, "Password is incorrect!");
		show('dialog');
		return;
	}

	changeDialog(4, "Signing in...");
	show('dialog');

	let authHash = Blake2b.hash("bloggy2020-" + password + "-" + username);
	Argon2id.hash(authHash, Blake2b.hash("bloggy2020-" + username), 16, 32, 4, 64).then(hash => {
		signin(username, hash, otp);
	});
}

function signin(username, password, otp){
	Bloggy.getToken(username, password, otp).then(response => {

		if(typeof response['error'] === 'undefined'){
			showDialogButtons();
			changeDialog(1, "Server is unreachable!");
			return;
		}

		if(response['error'] != 0){
			showDialogButtons();
			changeDialog(1, response.info);
			return;
		}

		writeData('username', username);
		writeData('token', response.data?.user?.token);
		writeData('user', JSON.stringify(response.data?.user));
		writeData('posts', JSON.stringify(response.data?.posts));
		writeData('loginTime', new Date().getTime());

		Bloggy.getMonthlyPageVisits(username, new Date().getMonth()).then(response => {
			let visitors = 0;
			let pageviews = 0;
			if(typeof(response) !== 'undefined' && typeof(response.visitors) === 'number') visitors = response.visitors;
			if(typeof(response) !== 'undefined' && typeof(response.pageviews) === 'number') pageviews = response.pageviews;
			writeData('analytics_main_visitors', visitors);
			writeData('analytics_main_pageviews', pageviews);

			window.location.href = 'panel.html';
		}).catch(err => {
			window.location.href = 'panel.html';
		});

	}).catch(err => {
		showDialogButtons();
		switch(err){
			case 1000:
				changeDialog(1, "Server is unreachable!");
			break;
			case 1002:
				changeDialog(1, "Username can only contain lowercase characters, numbers and hyphens. It also needs to start with lowercase character and be between 4 and 30 characters long.");
			break;
			case 1003:
				changeDialog(1, "Password is too short!");
			break;
			case 1006:
				changeDialog(1, "OTP is invalid!");
			break;
			default:
				changeDialog(1, "Unknown error!");
			break;
		}
	});
}