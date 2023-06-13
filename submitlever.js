class MainScript {
	constructor() {
		this.previousUrl = document.referrer;
		this.regexPattern = /^https?:\/\/[\w.-]+\/[\w.-]+\/[\w.-]+\/apply$/;
		this.configureApp(this.previousUrl);
		this.jobDescription = null;
	}

	submitJobDescription(jobData) {
            
	}

	async getDetails() {
		this.jobDescription = JSON.parse(
			(await chrome.storage.sync.get("jobDescription"))["jobDescription"]
		);
	}

	async configureApp(url) {
		await this.getDetails();
		if (this.regexPattern.test(url)) {
			if (this.jobDescription) {
				this.submitJobDescription(this.jobDescription)
			}
		}
	}
}

new MainScript();
