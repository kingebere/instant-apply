// Util function for getting the name of the company being applied to
function getCompanyName() {
	this.presentWindowUrl = window.location.href;
	return this.presentWindowUrl.split("/")[3];
}

class leverMainScript {
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
		this.addSubscribeModal();


	}

	removeSubscribeModal() {
		const modalContainer = document.body.querySelector(".modal-container");
		document.body.removeChild(modalContainer);
	}

	addSubscribeModal() {
		// Create the modal container
		var modalContainer = document.createElement("div");
		modalContainer.className = "modal-container";
		modalContainer.setAttribute(
			"style",
			`position: fixed;
		z-index: 9999;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		display:flex;
		z-indeX:100000;
		background-color: rgba(0, 0, 0, 0.5);
		 justify-content: center;
		 align-items: center;`
		);

		// Create the modal content
		var modalContent = document.createElement("div");
		modalContent.setAttribute(
			"style",
			` background-color: #fefefe;
			position:relative;
		display:flex;
		flex-direction: column;
		align-items:center;
		padding:1em;
		border: 1px solid #888;
		border-radius:.5em;
		height:300px;
		width: 90%;
		max-width: 500px;`
		);

		// Create the close button
		var closeButton = document.createElement("span");
		closeButton.innerHTML = "&times;";

		closeButton.setAttribute(
			"style",
			`
		color: #aaa;
		position: absolute;
		right:2%;
		font-size: 28px;
		font-weight: bold;
		cursor: pointer;
		`
		);

		// Create the modal title
		var modalTitle = document.createElement("h2");
		modalTitle.textContent = "Upgrade for Limitless Auto fills";
		modalTitle.style.marginBottom = "0";

		modalTitle.setAttribute(
			"style",
			`
		text-align:center;
		margin:1em .5em 0 0;
		color: #666;
		font-size: 28px;
		font-weight: bold;
		`
		);

		// Create the modal body
		var modalBody = document.createElement("a");
		modalBody.textContent = "Subscribe Now to get Unlimited Fills";
		modalBody.href = "https://instantapply.co/";

		modalBody.setAttribute(
			"style",
			`
		margin:0;
		color:blue;
		font-size: 18px;
		text-decoration:underline;
		`
		);

		var img = document.createElement("img");
		img.src = "https://instantapply.co/assets/images/subscribe.png";

		img.setAttribute(
			"style",
			`
		width:150px;
		height:90px;
		display:inline-block;
		marign: 0 auto;

		`
		);

		// Append the elements to the modal content
		modalContent.appendChild(closeButton);
		modalContent.appendChild(modalTitle);
		modalContent.appendChild(img);
		modalContent.appendChild(modalBody);

		// Append the modal content to the modal container
		modalContainer.appendChild(modalContent);

		// Append the modal container to the document body
		document.body.appendChild(modalContainer);
	}

	async handleFormSubmit(e) {
		// Construct job details and save on Chrome storage when user submits
		const {
			data: {
				session: {
					user: { id },
				},
			},
		} = JSON.parse((await chrome.storage.sync.get("session"))["session"]);

		const jobDescription = {
			position: this.jobPositionElement.textContent,
			companyApplied: getCompanyName(),
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
			`https://instantapply.co/api/count?userID=${userID}`
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

		// Styling the button
		img.style.position = "fixed";
		img.style.top = "10%";
		img.style.right = "7%";
		img.style.borderRadius = "8px";
		img.style.backgroundColor = "#ede2ff";
		img.style.padding = "10px";
		img.style.zIndex = "999";
		btn.style.cursor = "pointer";

		document.body.appendChild(btn);
		this.btn = btn;
		this.configurePopUpButton();
	}

	configurePopUpButton() {
		this.btn.addEventListener(
			"click",
			this.handlePopUpbuttonClicked.bind(this)
		);
	}

	configureApp() {
		window.onload = this.addPopUpButtonToPage();
	}
}

new leverMainScript();
