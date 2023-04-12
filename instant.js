//triggers  immediately after the page has been loaded
window.onload = () => {
	//adds the pdf to the file input field
	async function addFiles() {
		const token = (await chrome.storage.sync.get("accesstoken"))["accesstoken"];

		if (token) {
			const response = await fetch("http://localhost:8000/getUser", {
				headers: { Authorization: `Bearer ${token}` },
			});
			const {
				data
			} = await response.json();
			
			const phone = document.querySelector(
				"input[name='job_application[phone]']"
			);
			const lastName = document.querySelector(
				"input[name='job_application[last_name]']"
			);
			const firstName = document.querySelector(
				"input[name='job_application[first_name]']"
			);
			const email = document.querySelector(
				"input[name='job_application[email]']"
			);
			const github = document.querySelector(
				"input[name='job_application[answers_attributes][1][text_value]']"
			);
			const website = document.querySelector(
				"input[name='job_application[answers_attributes][2][text_value]']"
			);
			const linkedin = document.querySelector(
				"input[name='job_application[answers_attributes][3][text_value]']"
			);
			phone.value = data.phone;
			lastName.value = data.lastName;
			firstName.value = data.firstName;
			email.value = data.email;
			github.value = data.github;
			website.value = data.website;
			linkedin.value = data.linkedin;
			const yes = await fetch(data.pdf, {
				method: "GET",
				mode: "cors",
			});

			const red = await yes.blob();

			const myFile = new File([red], "game.pdf", {
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
		} else window.location.replace("https://www.uiland.design");
	}
	addFiles();
};
