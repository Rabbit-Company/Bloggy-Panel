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

		static getToken(username, password, otp = ""){
			return new Promise((resolve, reject) => {
				if(!Validate.username(username)) return reject(1002);
				if(!Validate.password(password)) return reject(1003);
				if(!Validate.otp(otp)) return reject(1006);

				let data = {
					username: username,
					password: password,
					otp: otp
				}

				fetch("https://api.bloggy.io/login", {
					method: "POST",
					headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						let data = JSON.parse(response);
						return resolve(data);
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static getPosts(username, token){
			return new Promise((resolve, reject) => {
				if(!Validate.username(username)) return reject(1002);
				if(!Validate.token(token)) return reject(1015);

				let data = {
					username: username,
					token: token
				}

				fetch("https://api.bloggy.io/getPosts", {
					method: "POST",
					headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						let data = JSON.parse(response);
						return resolve(data);
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static createPost(username, token, id, title, description, picture, markdown, category, language, tag, keywords){
			return new Promise((resolve, reject) => {
				if(!Validate.username(username)) return reject(1002);
				if(!Validate.token(token)) return reject(1015);
				if(!Validate.postID(id)) return reject(1018);
				if(!Validate.postTitle(title)) return reject(1019);
				if(!Validate.postDescription(description)) return reject(1020);
				if(!Validate.postPicture(picture)) return reject(1021);
				if(!Validate.postMarkdown(markdown)) return reject(1022);
				if(!Validate.category(category)) return reject(1012);
				if(!Validate.language(language)) return reject(1013);
				if(!Validate.postTag(tag)) return reject(1023);
				if(!Validate.postKeywords(keywords)) return reject(1024);

				let data = {
					username: username,
					token: token,
					id: id,
					title: title,
					description: description,
					picture: picture,
					markdown: markdown,
					category: category,
					language: language,
					tag: tag,
					keywords: keywords
				}

				fetch("https://api.bloggy.io/createPost", {
					method: "POST",
					headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				}).then((result) => {
					if (result.status != 200 && result.status != 429) return reject(1000);
					return result.text();
				}).then((response) => {
					try{
						let data = JSON.parse(response);
						return resolve(data);
					}catch(error){
						return reject(1000);
					}
				}).catch(() => {
					return reject(1000);
				});
			});
		}

		static deleteAccount(username, token){
			return new Promise((resolve, reject) => {
				if(!Validate.username(username)) return reject(1002);
				if(!Validate.token(token)) return reject(1015);

				let data = {
					username: username,
					token: token,
				}

				fetch("https://api.bloggy.io/deleteAccount", {
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

		static deletePost(username, token, id){
			return new Promise((resolve, reject) => {
				if(!Validate.username(username)) return reject(1002);
				if(!Validate.token(token)) return reject(1015);
				if(!Validate.postID(id)) return reject(1018);

				let data = {
					username: username,
					token: token,
					id: id
				}

				fetch("https://api.bloggy.io/deletePost", {
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
	}

	window.Bloggy = Bloggy;
	window.Validate = Validate;
})();