loadData().then(() => {
	startAuthenticator();

	let user = JSON.parse(readData('user'));

	document.getElementById("settings-lang").value = user.language;
	document.getElementById("settings-theme").value = user.theme;
	document.getElementById("settings-session").value = readData('sessionDuration');
});