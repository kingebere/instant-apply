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

	//handle when popbutton is clicked
	async handlePopUpbuttonClicked() {
		const session = (await chrome.storage.sync.get("session"))["session"];

		if (session) {
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
		} else window.open("https://instantapply.co", "_blank");
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

	//add event listener for when page loads
	configureApp() {
		if (
			/^https:\/\/boards\.greenhouse\.io\/\w+\/jobs\/\d+#[a-zA-Z]+$/.test(
				window.location.href
			)
		) {
			window.onload = this.addPopUpButtonToPage();
		}
	}
}

new greenhouseMainScript();
