class leverMain {
    constructor() {
        //get previous url
        this.previousUrl = document.referrer;
        //regex for testing if u are from the apply page 
        this.regexPattern = /^https?:\/\/[\w.-]+\/[\w.-]+\/[\w.-]+\/apply$/;
        
		this.configureApp(this.previousUrl);
		this.jobDescription = null;
	}

	async updateSubmitCountValue(userID) {
		await fetch("https://instantapply.co/api/count", {
			method: "POST",
			body: JSON.stringify({
				userID,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	async submitJobDescription() {
		const response = 	await fetch("https://instantapply.co/api/submitJob", {
			method: "POST",
			body: JSON.stringify({
				jobDescription: this.jobDescription,
			}),
			headers: {
				"Content-Type": "application/json",
			},
	});
		
		if (response.status === 200) { 
			this.updateSubmitCountValue(this.jobDescription.userID);
		}
	}

	async getDetails() {
		this.jobDescription = JSON.parse(
			(await chrome.storage.sync.get("jobDescription"))["jobDescription"]
		);
	}

	async configureApp(url) {
		//get job details stored in chrome storage when u submitted the form
		await this.getDetails();

		//test if user is coming from the apply page
		if (this.regexPattern.test(url)) {
			//submit the job details to server
			if (this.jobDescription) {
				this.submitJobDescription();
			}
		}
	}
}

new leverMain();
