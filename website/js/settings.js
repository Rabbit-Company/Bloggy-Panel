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