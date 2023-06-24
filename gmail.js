class gmailMainScript {
  constructor() {
    this.configureApp()
    this.btn = null
    this.token = null
  }

  fillnameEmailCompanyLinkedIn(
    gmailRecipientEmail,
    gmailSubject,
    gmailContent
  ) {
    const hiddensubjectElement = document.querySelector(".fX.aiL")
    const hiddensubjectElement2 = document.querySelector(".aoD.hl")
    const gmailSubjectElement = document.querySelector(
      "input[name='subjectbox']"
    )

    const emailElement = document.querySelector("input[class='agP aFw']")
    const emailElementField = document.querySelector(".aIa.aFw")

    //hides the recipient div
    hiddensubjectElement2.style.display = "none"
    //shows the targeted input
    if (hiddensubjectElement) {
      hiddensubjectElement.style.display = "block"
    }

    gmailSubjectElement.value = gmailSubject && gmailSubject

    emailElement.value = gmailRecipientEmail && gmailRecipientEmail
    emailElementField.value = gmailRecipientEmail && gmailRecipientEmail

 // Get the first div element
const targetDiv = document.querySelector('div.Am.Al.editable.LW-avf.tS-tW');

// Find the first child <div> element within the parent
const firstDiv = targetDiv.querySelector('div');

// Find the <br> tag inside the div
const brTag = firstDiv.querySelector('br');

// Find the nearest parent of the <br> tag
const ancestorElement = brTag.parentElement;

// Create a <pre> element
const preTag = document.createElement('pre');
preTag.style.whiteSpace = 'pre-wrap'; // Preserve line breaks and spaces

// Set the text content of the <pre> tag to the desired text
preTag.textContent = gmailContent;

// Replace the <br> tag with the <pre> tag
ancestorElement.replaceChild(preTag, brTag);


  
  }

  async uploadResume(resume_url, filename) {
    const getPDF = await fetch(resume_url, {
      method: "GET",
      mode: "cors",
    })

    const pdfBlob = await getPDF.blob()

    const myFile = new File([pdfBlob], filename + ".pdf", {
      type: "application/pdf",
      lastModified: new Date(),
    })

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(myFile)
    const dec = document.querySelector('input[type="file"][name="Filedata"]')
    dec.files = dataTransfer.files

    const event = new Event("change")
    dec.dispatchEvent(event)
  }

  async handlePopUpbuttonClicked() {
    const session = (await chrome.storage.sync.get("session"))["session"]

    if (session) {
      console.log(session)
      const response = await fetch("https://instantapply.co/api/getUser", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          session,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401)
        window.open("https://instantapply.co", "_blank")

      if (response.status === 200) {
        const clickCompose = document.querySelector(".T-I.T-I-KE.L3")
        clickCompose.click()
        this.data = await response.json()
        console.log(this.data)
        const {
          data: {
            gmailRecipientEmail,
            gmailSubject,
            gmailContent,
            resume_url,
            filename,
          },
        } = this.data
        this.uploadResume(resume_url, filename)
        this.fillnameEmailCompanyLinkedIn(
          gmailRecipientEmail,
          gmailSubject,
          gmailContent
        )
      }
    } else window.open("https://instantapply.co", "_blank")
  }

  addPopUpButtonToPage() {
    var btn = document.createElement("div")
    btn.classList.add("action_button")
    var img = document.createElement("img")
    img.src = "https://instantapply.co/assets/images/instantapply-logo.svg"
    img.style.width = "50px"
    img.style.height = "50px"
    btn.appendChild(img)
    //styling the button
    img.style.position = "fixed"
    img.style.top = "10%"
    img.style.right = "7%"
    img.style.borderRadius = "8px"
    img.style.backgroundColor = "#ede2ff"
    img.style.padding = "10px"
    img.style.zIndex = "999"
    btn.style.cursor = "pointer"
    document.body.appendChild(btn)
    this.btn = btn
    this.configurePopUpButton()
  }

  configurePopUpButton() {
    this.btn.addEventListener("click", this.handlePopUpbuttonClicked.bind(this))
  }

  configureApp() {
    window.addEventListener("load", () => {
      this.addPopUpButtonToPage()
    })
  }
}

new gmailMainScript()
