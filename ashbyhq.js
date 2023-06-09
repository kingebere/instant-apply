class ashbyhqMainScript {
  constructor() {
    this.configureApp();
    this.btn = null;
    this.token = null;

    this.firstNameElement = document.querySelector("input[name='_systemfield_name']");
    this.emailElement = document.querySelector("input[name='_systemfield_email']");
    this.phoneElement = document.querySelector("input[name='4361feaf-c5c8-438e-ad2e-99a76aa7fe1c']");
    this.linkedinElement = document.querySelector("input[name='8c32abcc-8cb5-4e39-bec5-c35260c6316a']");
  }

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
            linkedin,
            firstname,
            phone,
            resume_email,
            resume_url,
            filename,
          },
        } = this.data;

        this.updateNamePhoneEmail(firstname, resume_email, phone);
        this.updateLinkedinInputValue(linkedin);
        this.uploadResume(resume_url, filename);
      }
    } else {
      window.open("https://instantapply.co", "_blank");
    }
  }

  addPopUpButtonToPage() {
    var btn = document.createElement("div");
    btn.classList.add("action_button");
    var img = document.createElement("img");
    img.src = "https://instantapply.co/assets/images/instantapply-logo.svg";
    img.style.width = "60px";
    img.style.height = "60px";
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

  updateNamePhoneEmail(firstName, email, phone) {
    this.firstNameElement.value = firstName && firstName;
    this.emailElement.value = email && email;
    this.phoneElement.value = phone && phone;
  }

  updateLinkedinInputValue(linkedin) {
    this.linkedinElement.value = linkedin || "";
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

    const dec = document.querySelector(
      "div._container_1yn85_67 input[type='file']"
    );
    dec.files = dataTransfer.files;

    const event = new Event("change");
    dec.dispatchEvent(event);
  }
}

new ashbyhqMainScript();
