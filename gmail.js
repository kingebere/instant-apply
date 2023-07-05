function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}

// Function to generate a timestamp
function generateTimestamp() {
  const date = new Date()
  const timestamp = date.toISOString().replace(/[-:.TZ]/g, "")
  return timestamp
}

class gmailMainScript {
  constructor() {
    // this.configureApp()
    this.btn = null
    this.token = null
    this.mailID = generateRandomString(10)

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.url) {
        // Perform actions based on the URL change
        const url = message.url

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
    const session = (await chrome.storage.sync.get("session"))["session"]
    const {
      data: {
        session: { user },
      },
    } = JSON.parse(session)
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

    // Output: design@uiland.design

    // Get the first div element
    let targetDiv = document.querySelector("div.Am.Al.editable.LW-avf.tS-tW")

    const newDiv = document.createElement("div")

    // Create a <pre> element
    const preTag = document.createElement("pre")
    preTag.className = "instant-pre"
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

      // Send the email with the emailContent
      const recipientEmail = emailAddress

      this.receipientEmail = recipientEmail

      // Set the text content of the <pre> tag to the replaced content and include the pixel tracking URL in the email content
      preTag.textContent = replacedContent
      // Append the tracking pixel to the parent container
      this.targetDiv = targetDiv

      function generatePixelTrackingUrl(recipientEmail, mailID, senderEmail) {
        const baseUrl = "https://instantapply.co/api/tracking.gif"
        const timestamp = new Date().getTime()

        const uniqueUrl = `${baseUrl}?email=${encodeURIComponent(
          recipientEmail
        )}&jobId=${mailID}&_=${timestamp}&senderEmail=${senderEmail}`

        return uniqueUrl
      }

      const pixelTrackingUrl = generatePixelTrackingUrl(
        this.receipientEmail,
        this.mailID,
        user.email
      )

      // Create a <img> element for the tracking pixel
      const trackingPixel = document.createElement("img")
      trackingPixel.className = "track"
      trackingPixel.src = pixelTrackingUrl
      trackingPixel.width = 1
      trackingPixel.height = 1
      trackingPixel.style.display = "block"
      this.targetDiv.appendChild(trackingPixel)
      // targetDiv.appendChild(trackingPixel);
    } else {
      // Set the text content of the <pre> tag to the original content
      preTag.textContent = gmailContent
    }

    // Insert the newDiv as the first child node of targetDiv
    targetDiv.insertBefore(newDiv, targetDiv.firstChild)
    newDiv.appendChild(preTag)
    this.newDiv = newDiv
    this.subscribeformSubmitButton()
  }


  changeUrl() {
    // Regular expression pattern to match URLs
    const urlRegex = /(?:(?:https?|ftp):\/\/|www\.)[^\s/$.?#].[^\s]*/g;
  
    const modifiedPre = document.querySelector(".instant-pre");
    let newPreContent = modifiedPre.textContent;
  
    // Function to replace URLs with modified versions
    const replaceUrls = async (content) => {
      const matches = content.match(urlRegex); // Extract all URLs from the content
  
      if (!matches) {
        return content; // No URLs found, return the original content
      }
  
      // Replace URLs asynchronously
      const modifiedUrls = await Promise.all(
        matches.map(async (match) => {
          const result = await fetch("https://instantapply.co/api/encryptUrl", {
            method: "POST",
            body: JSON.stringify({ match }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await result.text();
  
          const modifiedUrl = `https://instantapply.co/api/link-tracker?id=${data}`;
  
          return modifiedUrl;
        })
      );
  
      // Replace the URLs in the content
      let currentIndex = 0;
      const modifiedContent = content.replace(urlRegex, () => {
        return modifiedUrls[currentIndex++];
      });
  
      return modifiedContent;
    };
  
    // Call the replaceUrls function with the HTML content
    (async () => {
      const modifiedContent = await replaceUrls(newPreContent);
      console.log("modifiedContent", modifiedContent);
      modifiedPre.textContent = modifiedContent;
    })();
  }
  
  
  

  async handleGmailFormClicked() {
    const session = (await chrome.storage.sync.get("session"))["session"]

  
    if (session) {
      const jobDescription = {
        receipientEmail: this.receipientEmail,
        job_id: this.mailID,
      }
      await fetch("https://instantapply.co/api/jobs", {
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
      btn.style.position="relative"

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
    this.btn.addEventListener("click", this.handlePopUp.bind(this))
  }

togglePopup(){
    if(modalSmallPopContainer.style.display==="none"){
      modalSmallPopContainer.style.display==="none"
    }else{
      modalSmallPopContainer.style.display==="block"
    }
  }

handlePopUp(){
  const modalSmallPopContainer=document.createElement("div")
  modalSmallPopContainer.setAttribute("style",`
  position: absolute;
  top: -118px;
  min-width: 160px;
  z-index: 10000000000;
  `)
  const modalPop= document.createElement("div");
  modalPop.className="small-popup";
  modalPop.setAttribute("style",`

  margin: 0;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.07), 0px 1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 8px;
    background: #fff;
    font-size: 14px;
    line-height: 22px;
    font-family: circular, Helvetica, sans-serif;

  `

  )
  const firstContent=document.createElement("div");
  firstContent.className="instant-popcontent";
  firstContent.setAttribute("style",`
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  display: flex;
  border-radius: 8px;
  padding: 5px 8px 5px 10px;
  background-color: transparent;
  cursor: pointer;
  color:black;
  `)

 const innerFirstContent=document.createElement("div");
 innerFirstContent.setAttribute("style",`
 
 `)
 innerFirstContent.textContent="AutoFill"
 firstContent.appendChild(innerFirstContent);

 firstContent.addEventListener("mouseover", () => {
   firstContent.style.backgroundColor = "#006aff";
   firstContent.style.color = "white";
 });
 
 firstContent.addEventListener("mouseout", () => {
  firstContent.style.backgroundColor = "transparent";
   firstContent.style.color = "black";
 });




 const secondContent=document.createElement("div");
  secondContent.className="instant-popcontent";
  secondContent.setAttribute("style",`
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  display: flex;
  border-radius: 8px;
  padding: 5px 8px 5px 10px;
  background-color: transparent;
  cursor: pointer;
  color:black;
  `)

 const innerSecondContent=document.createElement("div");
 innerSecondContent.setAttribute("style",`
 
 `)
 innerSecondContent.textContent="Track Links"
 secondContent.appendChild(innerSecondContent);

secondContent.addEventListener("mouseover", () => {
   secondContent.style.backgroundColor = "#006aff";
   secondContent.style.color = "white";
 });
 
 secondContent.addEventListener("mouseout", () => {
   secondContent.style.backgroundColor = "transparent";
   secondContent.style.color = "black";
 });


 const thirdContent = document.createElement("div");
thirdContent.className = "instant-popcontent";
thirdContent.setAttribute("style", `
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  display: flex;
  border-radius: 8px;
  padding: 5px 8px 5px 10px;
  background-color: transparent;
  cursor: pointer;
  color: black;
`);

const innerThirdContent = document.createElement("div");
innerThirdContent.textContent = "Track PDFs";

thirdContent.appendChild(innerThirdContent);

thirdContent.addEventListener("mouseover", () => {
  thirdContent.style.backgroundColor = "#006aff";
  thirdContent.style.color = "white";
});

thirdContent.addEventListener("mouseout", () => {
  thirdContent.style.backgroundColor = "transparent";
  thirdContent.style.color = "black";
});




firstContent.addEventListener("click",()=>{
  this.handlePopUpbuttonClicked(this)
   this.togglePopup(); 

})

secondContent.addEventListener("click",()=>{
  this.changeUrl(this)
  this.togglePopup(); 
})



modalPop.appendChild(firstContent)
modalPop.appendChild(secondContent)
modalPop.appendChild(thirdContent)
modalSmallPopContainer.appendChild(modalPop)
const button=document.querySelector(".action_button")
button.appendChild(modalSmallPopContainer)
}

  configureApp() {
    window.addEventListener("load", () => {
      this.addPopUpButtonToPage()
    })
  }
}

new gmailMainScript()
