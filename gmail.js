class gmailMainScript {
  constructor() {
    // this.configureApp()
    this.btn = null
    this.token = null

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.url) {
        // Perform actions based on the URL change
        const url = message.url
        console.log("Performing actions for URL:", url)

        // Call a function or trigger the desired action
        this.addPopUpButtonToPage()
      }
    })
  }

  async fillnameEmailCompanyLinkedIn(
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
    // const emailElementField = document.querySelector(".aIa.aFw")

    //hides the recipient div
    hiddensubjectElement2.style.display = "none"
    //shows the targeted input
    if (hiddensubjectElement) {
      hiddensubjectElement.style.display = "block"
    }

    gmailSubjectElement.value = gmailSubject && gmailSubject

    // emailElement.value = gmailRecipientEmail && gmailRecipientEmail
    // emailElementField.value = gmailRecipientEmail && gmailRecipientEmail

    //This gets the email when the email inputed is highlighted by gmail
    const element = document.querySelector("div.afV[data-hovercard-id]")
    const content = element.getAttribute("data-hovercard-id")

    console.log(content) // Output: design@uiland.design

    // Get the first div element
    let targetDiv = document.querySelector("div.Am.Al.editable.LW-avf.tS-tW")

    const newDiv = document.createElement("div")

    // Create a <pre> element
    const preTag = document.createElement("pre")
    preTag.style.whiteSpace = "pre-wrap" // Preserve line breaks and spaces
    preTag.style.font = "small/1.5 Arial,Helvetica,sans-serif"
    preTag.style.letterSpacing = "normal"

    if (content || emailElement) {
      // Email address
      const emailAddress = content || emailElement

      // Extract the text after the '@' symbol
      const atIndex = emailAddress.indexOf("@")
      const domain = emailAddress.substr(atIndex + 1)

      // Extract the text before the '.' symbol in the domain
      const dotIndex = domain.indexOf(".")
      const text = domain.substr(0, dotIndex)

      // Capitalize the first letter
      const companyName = text.charAt(0).toUpperCase() + text.slice(1)

      // Replace placeholder in gmailContent with companyName
      const replacedContent = gmailContent.replace("{{company}}", companyName)

      async function generatePixelTrackingUrl(recipientEmail, ipDatum) {
        let userStatus
        if (
          window.location.href.includes("#inbox") &&
          window.location.href.includes("compose")
        ) {
          userStatus = "sender"
        } else if (window.location.href.includes("#inbox")) {
          userStatus = "receiver"
        } else if (window.location.href.includes("#sent")) {
          userStatus = "sender"
        }

        const baseUrl = "https://instantapply.co/api/tracking.gif"
        const timestamp = new Date().getTime();
        const uniqueUrl = `${baseUrl}?email=${encodeURIComponent(
          recipientEmail
        )}&jobId=hallelu&userStatus=${userStatus}&userIp=${ipDatum}}&_=${timestamp}`

        console.log("uniqueUrl", uniqueUrl)
        return uniqueUrl
      }

      const recipientEmail = emailAddress
      this.receipientEmail = recipientEmail

      const response = await fetch("https://instantapply.co/api/getIp")

      const ipData = await response.text()
      const ipDatum = ipData.trim()

      const pixelTrackingUrl = await generatePixelTrackingUrl(
        recipientEmail,
        ipDatum
      )

      // Assuming you have the pixelTrackingUrl generated

      // Create a <img> element for the tracking pixel
      const trackingPixel = document.createElement("img")
      trackingPixel.className = "track"
      trackingPixel.src = pixelTrackingUrl
      trackingPixel.width = 1
      trackingPixel.height = 1
      trackingPixel.style.display = "none"

      // Send the email with the emailContent

      // Set the text content of the <pre> tag to the replaced content and include the pixel tracking URL in the email content
      preTag.textContent = replacedContent
      // Append the tracking pixel to the parent container
      targetDiv.appendChild(trackingPixel)
    } else {
      // Set the text content of the <pre> tag to the original content
      preTag.textContent = gmailContent
    }

    // Insert the newDiv as the first child node of targetDiv
    targetDiv.insertBefore(newDiv, targetDiv.firstChild)
    newDiv.appendChild(preTag)
    this.subscribeformSubmitButton()
  }

  async handleGmailFormClicked() {
    const session = (await chrome.storage.sync.get("session"))["session"]
    if (session) {
      const jobDescription = {
        receipientEmail: this.receipientEmail,
        job_id: "hallelu",
      }
      const response = await fetch("https://instantapply.co/api/jobs", {
        method: "POST",
        body: JSON.stringify({
          session,
          jobDescription,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    }
  }

  subscribeformSubmitButton() {
    document
      .querySelector(".T-I.J-J5-Ji.aoO.v7.T-I-atl.L3")
      .addEventListener("click", this.handleGmailFormClicked.bind(this))
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
        // const clickCompose = document.querySelector(".T-I.T-I-KE.L3")
        // clickCompose.click()
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
    const currentUrl = window.location.href
    const targetUrl = "https://mail.google.com/mail/u/0/#inbox?compose=new"

    if (currentUrl === targetUrl) {
      var btn = document.createElement("div")
      btn.classList.add("action_button")

      var img = document.createElement("img")
      img.src = "https://instantapply.co/assets/images/instantapply-logo.svg"
      img.style.width = "24px"
      img.style.height = "24px"
      btn.appendChild(img)

      // Styling the button
      img.style.top = "10%"
      img.style.right = "7%"
      img.style.borderRadius = "8px"
      img.style.backgroundColor = "#ede2ff"
      img.style.padding = "6px"
      img.style.marginLeft = "6px"
      img.style.zIndex = "999"
      btn.style.cursor = "pointer"

      // Find the target element to append the button
      var targetElement = document.querySelector("tr.btC")
      var td = document.createElement("td")
      td.appendChild(btn)

      // Get the first child (first td) in the row
      var firstChild = targetElement.firstElementChild

      // Insert the new td after the first child
      firstChild.insertAdjacentElement("afterend", td)

      this.btn = td
      this.configurePopUpButton()
    }
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
