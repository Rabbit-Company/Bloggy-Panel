(function(){

	const themes = ['light'];
	const categories = ['Art and Design', 'Book and Writing', 'Business', 'Car', 'DIY Craft', 'Fashion and Beauty', 'Finance', 'Food', 'Gaming', 'Health and Fitness', 'Lifestyle', 'Movie', 'Music', 'News', 'Parenting', 'Personal', 'Pet', 'Political', 'Religion', 'Review', 'Sports', 'Technology', 'Travel'];
	const languages = ['ab','aa','af','ak','sq','am','ar','an','hy','as','av','ae','ay','az','bm','ba','eu','be','bn','bh','bi','bs','br','bg','my','ca','km','ch','ce','ny','zh','cu','cv','kw','co','cr','hr','cs','da','dv','nl','dz','en','eo','et','ee','fo','fj','fi','fr','ff','gd','gl','lg','ka','de','ki','el','kl','gn','gu','ht','ha','he','hz','hi','ho','hu','is','io','ig','id','ia','ie','iu','ik','ga','it','ja','jv','kn','kr','ks','kk','rw','kv','kg','ko','kj','ku','ky','lo','la','lv','lb','li','ln','lt','lu','mk','mg','ms','ml','mt','gv','mi','mr','mh','ro','mn','na','nv','nd','ng','ne','se','no','nb','nn','ii','oc','oj','or','om','os','pi','pa','ps','fa','pl','pt','qu','rm','rn','ru','sm','sg','sa','sc','sr','sn','sd','si','sk','sl','so','st','nr','es','su','sw','ss','sv','tl','ty','tg','ta','tt','te','th','bo','ti','to','ts','tn','tr','tk','tw','ug','uk','ur','uz','ve','vi','vo','wa','cy','fy','wo','xh','yi','yo','za','zu'];

	class Validate{

		static username(username){
			if(typeof(username) == 'undefined' || username == null) return false;
			return /^([a-z][a-z0-9\-]{3,29})$/i.test(username);
		}

		static password(password){
			if(typeof(password) == 'undefined' || password == null) return false;
			return password.length >= 8;
		}

		static email(email){
			if(typeof(email) == 'undefined' || email == null) return false;
			return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i.test(email);
		}

		static otp(otp){
			if(typeof(otp) == 'undefined' || otp == null) return false;
			return (otp.length == 0 || otp.length == 6 || otp.length == 44);
		}

		static token(token){
			if(typeof(token) == 'undefined' || token == null) return false;
			return /^[a-z0-9]{128}$/i.test(token);
		}

		static title(title){
			if(typeof(title) !== 'string' || title === null) return false;
			return (title.length >= 3 && title.length <= 30);
		}

		static description(description){
			if(typeof(description) !== 'string' || description === null) return false;
			return (description.length >= 30 && description.length <= 160);
		}

		static author(author){
			if(typeof(author) !== 'string' || author === null) return false;
			return (author.length >= 5 && author.length <= 30);
		}

		static category(category){
			if(typeof(category) !== 'string' || category === null) return false;
			return categories.includes(category);
		}

		static language(language){
			if(typeof(language) !== 'string' || language === null) return false;
			return languages.includes(language);
		}

		static theme(theme){
			if(typeof(theme) !== 'string' || theme === null) return false;
			return themes.includes(theme);
		}

		static postID(id){
			if(typeof(id) !== 'string' || id === null) return false;
			return /^([a-z][a-z0-9\-]{4,100})$/.test(id);
		}

		static postTitle(title){
			if(typeof(title) !== 'string' || title === null) return false;
			return (title.length >= 5 && title.length <= 100);
		}

		static postDescription(description){
			if(typeof(description) !== 'string' || description === null) return false;
			return (description.length >= 30 && description.length <= 300);
		}

		static postPicture(picture){
			if(typeof(picture) !== 'string' || picture === null) return false;
			return (picture.length >= 5 && picture.length <= 500);
		}

		static postTag(tag){
			if(typeof(tag) !== 'string' || tag === null) return false;
			return (tag.length >= 3 && tag.length <= 30);
		}

		static postKeywords(keywords){
			if(typeof(keywords) !== 'string' || keywords === null) return false;
			if(keywords.length >= 255) return false;
			keywords = keywords.split(',');
			return (keywords.length >= 3 && keywords.length <= 20);
		}

		static postMarkdown(markdown){
			if(typeof(markdown) !== 'string' || markdown === null) return false;
			if(markdown.length > 100000) return false;
			let words = getWordCount(markdown);
			return (words >= 150 && words <= 10000);
		}

		static positiveInteger(number){
			if(typeof(number) == 'undefined' || number == null) return false;
			return number >>> 0 === parseFloat(number);
		}

		static yubiKey(id){
			if(typeof(id) == 'undefined' || id == null) return false;
			return id.length == 44;
		}

		static json(json){
			try{
				JSON.parse(json);
				return true;
			}catch{}
			return false;
		}
	}

	class Bloggy{

		static createAccount(username, password, email, title, description, author, category, language, theme){
			return new Promise((resolve, reject) => {
				if(!Validate.username(username)) return reject(1002);
				if(!Validate.password(password)) return reject(1003);
				if(!Validate.email(email)) return reject(1004);
				if(!Validate.title(title)) return reject(1009);
				if(!Validate.description(description)) return reject(1010);
				if(!Validate.author(author)) return reject(1011);
				if(!Validate.category(category)) return reject(1012);
				if(!Validate.language(language)) return reject(1013);
				if(!Validate.theme(theme)) return reject(1014);

				let data = {
					username: username,
					password: password,
					email: email,
					title: title,
					description: description,
					author: author,
					category: category,
					language: language,
					theme: theme
				}

				fetch("https://api.bloggy.io/register", {
					method: "POST",
					headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static getToken(username, password, otp = "", encrypted = true){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.password(password)) return reject(1006);
				if(!Validate.otp(otp)) return reject(1002);

				let data = {

				}

				fetch("https://api.bloggy.io/login", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						let data = JSON.parse(response);
						if(!encrypted && data.passwords != null){
							for(let i = 0; i < data.passwords.length; i++){
								data.passwords[i].website = XChaCha20.decrypt(data.passwords[i].website, password);
								data.passwords[i].username = XChaCha20.decrypt(data.passwords[i].username, password);
								data.passwords[i].password = XChaCha20.decrypt(data.passwords[i].password, password);
								data.passwords[i].message = XChaCha20.decrypt(data.passwords[i].message, password);
							}
						}
						return resolve(data);
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static getPasswords(server, username, token, password = "", encrypted = true){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.token(token)) return reject(1003);
				if(!encrypted && !Validate.password(password)) return reject(1006);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

				fetch(server + "?action=getPasswords", {
					method: "POST",
					headers: headers
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						let data = JSON.parse(response);
						if(!encrypted && data.passwords != null){
							for(let i = 0; i < data.passwords.length; i++){
								data.passwords[i].website = XChaCha20.decrypt(data.passwords[i].website, password);
								data.passwords[i].username = XChaCha20.decrypt(data.passwords[i].username, password);
								data.passwords[i].password = XChaCha20.decrypt(data.passwords[i].password, password);
								data.passwords[i].message = XChaCha20.decrypt(data.passwords[i].message, password);
							}
						}
						return resolve(data);
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static savePassword(server, username, token, password, [pWebsite, pUsername, pPassword, pMessage]){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.token(token)) return reject(1003);
				if(!Validate.password(password)) return reject(1006);

				if(!Validate.pWebsite(pWebsite)) return reject(1008);
				if(!Validate.pUsername(pUsername)) return reject(1009);
				if(!Validate.pPassword(pPassword)) return reject(1010);
				if(!Validate.pMessage(pMessage)) return reject(1011);

				pWebsite = XChaCha20.encrypt(pWebsite, password);
				pUsername = XChaCha20.encrypt(pUsername, password);
				pPassword = XChaCha20.encrypt(pPassword, password);
				pMessage = XChaCha20.encrypt(pMessage, password);

				if(pWebsite.length > 255) return reject(1008);
				if(pUsername.length > 255) return reject(1009);
				if(pPassword.length > 255) return reject(1010);
				if(pMessage.length > 10000) return reject(1011);

				let data = new FormData();
				data.append("website", pWebsite);
				data.append("username", pUsername);
				data.append("password", pPassword);
				data.append("message", pMessage);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

				fetch(server + "?action=savePassword", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static editPassword(server, username, token, password, passwordID, [pWebsite, pUsername, pPassword, pMessage]){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.token(token)) return reject(1003);
				if(!Validate.password(password)) return reject(1006);
				if(!Validate.positiveInteger(passwordID)) return reject(1012);
				if(!Validate.pWebsite(pWebsite)) return reject(1008);
				if(!Validate.pUsername(pUsername)) return reject(1009);
				if(!Validate.pPassword(pPassword)) return reject(1010);
				if(!Validate.pMessage(pMessage)) return reject(1011);

				pWebsite = XChaCha20.encrypt(pWebsite, password);
				pUsername = XChaCha20.encrypt(pUsername, password);
				pPassword = XChaCha20.encrypt(pPassword, password);
				pMessage = XChaCha20.encrypt(pMessage, password);

				if(pWebsite.length > 255) return reject(1008);
				if(pUsername.length > 255) return reject(1009);
				if(pPassword.length > 255) return reject(1010);
				if(pMessage.length > 10000) return reject(1011);

				let data = new FormData();
				data.append("password_id", passwordID);
				data.append("website", pWebsite);
				data.append("username", pUsername);
				data.append("password", pPassword);
				data.append("message", pMessage);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

				fetch(server + "?action=editPassword", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static deletePassword(server, username, token, passwordID){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.token(token)) return reject(1003);
				if(!Validate.positiveInteger(passwordID)) return reject(1012);

				let data = new FormData();
				data.append("password_id", passwordID);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

				fetch(server + "?action=deletePassword", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static deletePasswords(server, username, token){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.token(token)) return reject(1003);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

				fetch(server + "?action=deletePasswords", {
					method: "POST",
					headers: headers
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static deleteAccount(server, username, token){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.token(token)) return reject(1003);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

				fetch(server + "?action=deleteAccount", {
					method: "POST",
					headers: headers
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static enable2FA(server, username, token){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.token(token)) return reject(1003);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

				fetch(server + "?action=enable2fa", {
					method: "POST",
					headers: headers
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static disable2FA(server, username, token){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.token(token)) return reject(1003);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

				fetch(server + "?action=disable2fa", {
					method: "POST",
					headers: headers
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static addYubiKey(server, username, token, id){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.token(token)) return reject(1003);
				if(!Validate.yubiKey(id)) return reject(1004);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

				let data = new FormData();
				data.append("id", id);

				fetch(server + "?action=addYubiKey", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static removeYubiKey(server, username, token, id){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.token(token)) return reject(1003);
				if(!Validate.yubiKey(id)) return reject(1004);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

				let data = new FormData();
				data.append("id", id);

				fetch(server + "?action=removeYubiKey", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static forgotUsername(server, email){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.email(email)) return reject(1007);

				let data = new FormData();
				data.append("email", email);

				fetch(server + "?action=forgotUsername", {
					method: "POST",
					body: data
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static upgradeAccount(server, username, token, license){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.token(token)) return reject(1003);
				if(!Validate.license(license)) return reject(1014);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));

				let data = new FormData();
				data.append("license", license);

				fetch(server + "?action=upgradeAccount", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static importPasswords(server, username, token, passwords, encrypted = false, password = ""){
			return new Promise((resolve, reject) => {
				if(!Validate.url(server)) return reject(1001);
				if(!Validate.username(username)) return reject(1005);
				if(!Validate.token(token)) return reject(1003);

				if(!encrypted){
					if(!Validate.password(password)) return reject(1006);

					for(let i = 0; i < Object.keys(passwords).length; i++){
						passwords[i].website = XChaCha20.encrypt(passwords[i].website, password);
						passwords[i].username = XChaCha20.encrypt(passwords[i].username, password);
						passwords[i].password = XChaCha20.encrypt(passwords[i].password, password);
						if(!Validate.pMessage(passwords[i].message)) passwords[i].message = "";
						passwords[i].message = XChaCha20.encrypt(passwords[i].message, password);
					}
				}

				let importPasswords = [];

				for(let i = 0, j = 0; i < Object.keys(passwords).length; i++){
					if(!(passwords[i].website.length >= 35 && passwords[i].website.length <= 255) || passwords[i].website.indexOf(' ') !== -1) continue;
					if(!(passwords[i].username.length >= 35 && passwords[i].username.length <= 255) || passwords[i].username.indexOf(' ') !== -1) continue;
					if(!(passwords[i].password.length >= 35 && passwords[i].password.length <= 255) || passwords[i].password.indexOf(' ') !== -1) continue;
					if(!(passwords[i].message.length >= 35 && passwords[i].message.length <= 10000) || passwords[i].password.indexOf(' ') !== -1) continue;

					importPasswords[j] = {};
					importPasswords[j]["website"] = passwords[i].website;
					importPasswords[j]["username"] = passwords[i].username;
					importPasswords[j]["password"] = passwords[i].password;
					importPasswords[j]["message"] = passwords[i].message;
					j++;
				}

				if(importPasswords.length == 0) return reject(1013);

				let headers = new Headers();
				headers.append('Authorization', 'Basic ' + btoa(username + ":" + token));
				headers.append('Content-Type', 'application/json');

				let data = JSON.stringify(importPasswords);

				fetch(server + "?action=importPasswords", {
					method: "POST",
					headers: headers,
					body: data
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						return resolve(JSON.parse(response));
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}
	}

	window.Bloggy = Bloggy;
	window.Validate = Validate;
})();