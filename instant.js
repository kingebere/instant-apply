function getCompnayName() {
	this.presentWindowUrl = window.location.href;

	return this.presentWindowUrl.split("/")[3];
}
class greenhouseMainScript {
	constructor() {
		this.configureApp();
		this.btn = null;
		this.token = null;
		this.phoneElement = document.querySelector(
			"input[name='job_application[phone]']"
		);
		this.lastNameElement = document.querySelector(
			"input[name='job_application[last_name]']"
		);
		this.firstNameElement = document.querySelector(
			"input[name='job_application[first_name]']"
		);
		this.emailElement = document.querySelector(
			"input[name='job_application[email]']"
		);
		this.jobPositionElement = document.querySelector(".app-title");
		this.locationElement = document.querySelector(".location");
	}

	async handleFormSubmit(e) {
		// construct job details and save on chrome storge when user submits
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
			jobBoard: "greenhouse",
			applicationUrl: window.location.href,
			location: this.locationElement.textContent,
			userID: id,
		};

		chrome.storage.sync.set(
			{ jobDescription: JSON.stringify(jobDescription) },
			function () {}
		);
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
		closeButton.className = "close-icon";

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
		height:120px;
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

		this.configureElementToRemoveModal(".modal-container");
		this.configureElementToRemoveModal(".close-icon");
	}

	//handle when popbutton is clicked
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
			if (count < 40) {
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
							gender,
							youlatino,
							firstname,
							phone,
							resume_email,
							resume_url,
							disabilitystatus,
							veteranstatus,
							github,
							filename,
						},
					} = this.data;

					this.updateNamePhoneEmail(firstname, lastname, resume_email, phone);
					// Call the function to update the Github input value
					this.updateGithubInputValue(github);
					// Call the function to update the Linkedin input value
					this.updateLinkedinInputValue(linkedin);
					// Call the function to update the DOM
					this.updateGender(gender);
					// Call the function to update the DOM
					this.youLatino(youlatino);
					// Call the function to update the DOM
					this.updateVeteranStatus(veteranstatus);
					// Call the function to update the DOM
					this.disabilityStatus(disabilitystatus);
					this.uploadResume(resume_url, filename);
				}
			} else {
				this.addSubscribeModal();
			}
		} else window.open("https://instantapply.co", "_blank");
	}

	configureElementToRemoveModal(className) {
		document
			.querySelector(className)
			.addEventListener("click", this.removeSubscribeModal.bind(this));
	}

	addPopUpButtonToPage() {
		var btn = document.createElement("div");
		btn.classList.add("action_button");
		var img = document.createElement("img");
		img.src = "https://instantapply.co/assets/images/instantapply-logo.svg";
		img.style.width = "60px";
		img.style.height = "60px";
		btn.appendChild(img);
		//styling the button
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
		document
			.querySelector("#submit_app")
			.addEventListener("click", this.handleFormSubmit.bind(this));

		this.addAiButton();
	}

	//add event listener to popup button
	configurePopUpButton() {
		this.btn.addEventListener(
			"click",
			this.handlePopUpbuttonClicked.bind(this)
		);
	}

	updateNamePhoneEmail(firstName, lastName, email, phone) {
		this.firstNameElement.value = firstName && firstName;
		this.lastNameElement.value = lastName && lastName;
		this.emailElement.value = email && email;
		this.phoneElement.value = phone && phone;
	}

	updateGithubInputValue(github) {
		// Get the div elements containing the labels
		const divElements = document.querySelectorAll("#custom_fields > .field");

		// Find the div element with the "Github" label
		let githubDiv;
		for (const divElement of divElements) {
			const label = divElement.querySelector("label");
			if (label && label.textContent.includes("Github")) {
				githubDiv = divElement;
				break;
			}
		}

		// If the "Github" div element is found, update the input value
		if (githubDiv) {
			const input = githubDiv.querySelector('input[type="text"]');
			if (input) {
				const updatedValue = github;
				input.value = updatedValue;
			}
		}
	}
	//update LinkedIn
	updateLinkedinInputValue(linkedin) {
		// Get the div elements containing the labels
		const divElements = document.querySelectorAll("#custom_fields > .field");

		// Find the div element with the "Linkedin" label
		let linkedinDiv;
		for (const divElement of divElements) {
			const label = divElement.querySelector("label");
			if (label && label.textContent.includes("LinkedIn")) {
				linkedinDiv = divElement;
				break;
			}
		}

		// If the "LinkedIn" div element is found, update the input value
		if (linkedinDiv) {
			const input = linkedinDiv.querySelector('input[type="text"]');
			if (input) {
				const updatedValue = linkedin;
				input.value = updatedValue;
			}
		}
	}

	//add gender
	updateGender(gender) {
		// Find the parent element with the ID "s2id_job_application_gender"
		const parentElement = document.getElementById(
			"s2id_job_application_gender"
		);

		// If the parent element is found
		if (parentElement) {
			// Find the child element with the class name "select2-chosen"
			const select2ChosenElement =
				parentElement.querySelector(".select2-chosen");

			// Update the child element's text content to a Selected Gender
			select2ChosenElement.textContent = gender;
		}
	}

	//add "are you a latino"
	youLatino(youlatino) {
		// Find the parent element with the ID "  s2id_job_application_hispanic_ethnicity"
		const parentElement = document.getElementById(
			"s2id_job_application_hispanic_ethnicity"
		);

		// If the parent element is found
		if (parentElement) {
			// Find the child element with the class name "select2-chosen"
			const select2ChosenElement =
				parentElement.querySelector(".select2-chosen");

			// Update the child element's text content to a boolean
			select2ChosenElement.textContent = youlatino;
		}
	}
	updateVeteranStatus(veteranstatus) {
		// Find the parent element with the ID "s2id_job_application_veteran_status"
		const parentElement = document.getElementById(
			"s2id_job_application_veteran_status"
		);

		// If the parent element is found
		if (parentElement) {
			// Find the child element with the class name "select2-chosen"
			const select2ChosenElement =
				parentElement.querySelector(".select2-chosen");

			// Update the child element's text content
			select2ChosenElement.textContent = veteranstatus;
		}
	}
	//add veteran status
	disabilityStatus(disabilitystatus) {
		// Find the parent element with the ID "s2id_job_application_disability_status"
		const parentElement = document.getElementById(
			"s2id_job_application_disability_status"
		);

		// If the parent element is found
		if (parentElement) {
			// Find the child element with the class name "select2-chosen"
			const select2ChosenElement =
				parentElement.querySelector(".select2-chosen");

			// Update the child element's text content to a boolean
			select2ChosenElement.textContent = disabilitystatus;
		}
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
		const dec = document.querySelector(
			"#s3_upload_for_resume input[type='file']"
		);
		dec.files = dataTransfer.files;

		const event = new Event("change");

		dec.dispatchEvent(event);
	}

	addAiButton() {
		const button = document.createElement("div");
		button.className = "ai-button";
		button.textContent = "Instant Cover-Letter?";

		button.setAttribute(
			"style",
			`
        padding: 1.5em 1EM;
		 margin:1em 0;
		 display: inline-block;
		 background-color:blue;
		 color:white;
		 border-radius:.5em;
		 font-weight:medium;
		 font-size:14px;
		 cursor:pointer;
		`
		);

		const textArea = document.querySelector(
			"#job_application_answers_attributes_4_priority"
		);

		if (textArea) {
			textArea.setAttribute(
				"style",
				`
			position:relative;
			`
			);
			textArea.parentNode.appendChild(button);
		}
		this.configureAiButtonClick();
	}

	async handleAiButtonClicked() {
		const session = (await chrome.storage.sync.get("session"))["session"];

		if (session) {
			const {
				data: {
					session: {
						user: { id },
					},
				},
			} = JSON.parse(session);

			const jobDescription = JSON.stringify({
				jobTitle: this.jobPositionElement.textContent,
				jobRequirements: document
					.querySelector("#content p:nth-of-type(7)+ul")
					.textContent.trim(),
			});

			try {
				const response = await fetch("https://instantapply.co/api/content", {
					method: "POST",
				
					body: JSON.stringify({
						session,
						jobDescription,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (response.status === 200) {
					const data = await response.json();
					document.querySelector(
						"#job_application_answers_attributes_4_text_value"
					).value = data.message;
				}
			} catch (e) {
				alert("An error occurred");
				console.log(e);
			}
		} else window.open("https://instantapply.co", "_blank");
	}

	configureAiButtonClick() {
		document
			.querySelector(".ai-button")
			.addEventListener("click", this.handleAiButtonClicked.bind(this));
	}

	//add event listener for when page loads
	configureApp() {
		if (
			/^https:\/\/boards\.greenhouse\.io\/\w+\/jobs\/\d/.test(
				window.location.href
			)
		) {
			window.onload = this.addPopUpButtonToPage();
		}
	}
}

new greenhouseMainScript();
