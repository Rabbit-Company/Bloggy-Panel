loadData().then(() => {
	startAuthenticator();

	let user = JSON.parse(readData('user'));

	document.getElementById("settings-lang").value = user.language;
	document.getElementById("settings-theme").value = user.theme;
	document.getElementById("settings-session").value = readData('sessionDuration');

	if(user.fa_enabled === true){
		document.getElementById("toggle-2fa-btn").innerText = "Disable";
		document.getElementById("toggle-2fa-btn").className = "dangerButton font-bold inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md focus:outline-none sm:text-sm";
	}else{
		document.getElementById("toggle-2fa-btn").innerText = "Enable";
		document.getElementById("toggle-2fa-btn").className = "successButton font-bold inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md focus:outline-none sm:text-sm";
	}
});