//util function for getting the name of the company being applied to

function getCompnayName() {
	this.presentWindowUrl = window.location.href;

	return this.presentWindowUrl.split("/")[3];
}

class MainScript {
	constructor() {
		this.configureApp();
		this.btn = null;
		this.token = null;
		this.fullNameElement = document.querySelector("input[name='name']");
		this.emailElement = document.querySelector("input[name='email']");
		this.phoneElement = document.querySelector("input[name='phone']");
		this.companyElement = document.querySelector("input[name='org']");
		this.linkedinElement = document.querySelector(
			"input[name='urls[LinkedIn]']"
		);
		this.jobPositionElement = document.querySelector(".posting-header h2");
		this.locationElement = document.querySelector(".posting-category.location");
		this.commitmentElement = document.querySelector("div.commitment");
		this.formElement = document.querySelector("#application-form");
		this.configureForm();
	}

	async handleFormSubmit(e) {
		//construct job details and save on chrome storge when user submits
		const {
			data: {
				session: {
					user: { id },
				},
			},
		} = JSON.parse((await chrome.storage.sync.get("session"))["session"]);
		const jobDescription = {
			position: this.jobPositionElement.textContent,
			companyApplied: getCompnayName(),
			jobBoard: "lever",
			applicationUrl: window.location.href,
			location: this.locationElement.textContent.slice(0, -1),
			commitment: this.commitmentElement.textContent,
			userID: id,
		};
		chrome.storage.sync.set(
			{ jobDescription: JSON.stringify(jobDescription) },
			function () {}
		);
	}

	configureForm() {
		this.formElement.addEventListener(
			"submit",
			this.handleFormSubmit.bind(this)
		);
	}

	fillnameEmailCompanyLinkedIn(
		fullName,
		email,
		phone,
		currentCompany,
		linkedin
	) {
		this.fullNameElement.value = fullName && fullName;
		this.emailElement.value = email && email;
		this.phoneElement.value = phone && phone;
		this.companyElement.value = currentCompany && currentCompany;
		this.linkedinElement.value = linkedin;
	}
	async uploadResume(resume_url, filename) {
		// website.value = data.data.website && data.data.website;
		const getPDF = await fetch(resume_url, {
			method: "GET",
			mode: "cors",
		});

		const pdfBlob = await getPDF.blob();

		const myFile = new File([pdfBlob], filename, {
			type: "application/pdf",
			lastModified: new Date(),
		});

		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(myFile);
		const dec = document.querySelector("#resume-upload-input");
		dec.files = dataTransfer.files;

		const event = new Event("change");

		dec.dispatchEvent(event);
	}

	async fetchCount(userID) {
		const response = await fetch(
			`http://localhost:8000/count?userID=${userID}`
		);

		if (response.status === 200) {
			const { count } = await response.json();
			return count;
		}
		return 0;
	}

	async handlePopUpbuttonClicked() {
		const session = (await chrome.storage.sync.get("session"))["session"];
		if (session) {
			const {
				data: {
					session: {
						user: { id },
					},
				},
			} = JSON.parse(session);
			const count = await this.fetchCount(id);
			if (count < 50) {
				const response = await fetch("https://instantapply.co/api/getUser", {
					method: "POST",
					mode: "cors",
					body: JSON.stringify({
						session,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (response.status === 401)
					window.open("https://instantapply.co", "_blank");

				if (response.status === 200) {
					this.data = await response.json();
					const {
						data: {
							lastname,
							linkedin,
							firstname,
							phone,
							resume_email,
							resume_url,
							filename,
							currentCompany,
						},
					} = this.data;
					this.fillnameEmailCompanyLinkedIn(
						`${firstname} ${lastname}`,
						resume_email,
						phone,
						currentCompany,
						linkedin
					);
					this.uploadResume(resume_url, filename);
				}
			} else {
				alert("your free clicks are done");
			}
		} else window.open("https://instantapply.co", "_blank");
	}

	addPopUpButtonToPage() {
		var btn = document.createElement("div");
		btn.classList.add("action_button");
		var img = document.createElement("img");
		img.src = "https://instantapply.co/assets/images/instantapply-logo.svg";
		img.style.width = "50px";
		img.style.height = "50px";
		btn.appendChild(img);
		//styling the button
		img.style.position = "fixed";
		img.style.top = "10%";
		img.style.right = "7%";
		img.style.borderRadius = "8px";
		img.style.backgroundColor = "#ede2ff";
		img.style.padding = "10px";
		img.style.zIndex = "999";
		// btn.style.height = "50px";
		// btn.style.width = "50px";
		// btn.style.color = "white";
		// btn.style.fontSize = "22px";
		// btn.style.fontWeight = "bold";
		// btn.style.backgroundColor = "#999";
		// btn.style.borderRadius = "50%";
		// btn.style.display = "flex";
		// btn.style.alignItems = "center";
		// btn.style.justifyContent = "center";
		btn.style.cursor = "pointer";
		document.body.appendChild(btn);
		this.btn = btn;
		this.configurePopUpButton();
	}

	//add event listener to popup button
	configurePopUpButton() {
		this.btn.addEventListener(
			"click",
			this.handlePopUpbuttonClicked.bind(this)
		);
	}

	//add event listener for when page loads
	configureApp() {
		window.onload = this.addPopUpButtonToPage();
	}
}

new MainScript();
