//triggers  immediately after the page has been loaded

window.onload = () => {
  //adds the pdf to the file input field

  var btn = document.createElement("div")
  btn.classList.add("action_button")

  var img = document.createElement("img")
  img.src = "https://instantapply.co/assets/images/Instantapply-logo.png"
  img.style.width = "50px"
  img.style.height = "50px"
  btn.appendChild(img)

  //styling the button
  img.style.position = "fixed"
  img.style.top = "10%"
  img.style.right = "7%"
  // btn.style.height = "50px";
  // btn.style.width = "50px";
  // btn.style.color = "white";
  // btn.style.fontSize = "22px";
  // btn.style.fontWeight = "bold";
  // btn.style.backgroundColor = "#999";
  // btn.style.borderRadius = "50%";
  // btn.style.display = "flex";
  // btn.style.alignItems = "center";
  // btn.style.justifyContent = "center";

  btn.style.cursor = "pointer"

  document.body.appendChild(btn)

  async function addFiles() {
    const token = (await chrome.storage.sync.get("accesstoken"))["accesstoken"]

    if (token) {
      const response = await fetch("https://instantapply.co/api/getUser", {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()

      console.log("data", data)
      const phone = document.querySelector(
        "input[name='job_application[phone]']"
      )
      const lastName = document.querySelector(
        "input[name='job_application[last_name]']"
      )
      const firstName = document.querySelector(
        "input[name='job_application[first_name]']"
      )
      const email = document.querySelector(
        "input[name='job_application[email]']"
      )

      // phone.value = data.data.phone &&  data.data.phone;
      lastName.value = data.data.lastname && data.data.lastname
      firstName.value = data.data.firstname && data.data.firstname
      phone.value = data.data.phone && data.data.phone
      email.value = data.data.resume_email && data.data.resume_email

      //update Github
      function updateGithubInputValue() {
        // Get the div elements containing the labels
        const divElements = document.querySelectorAll("#custom_fields > .field")

        // Find the div element with the "Github" label
        let githubDiv
        for (const divElement of divElements) {
          const label = divElement.querySelector("label")
          if (label && label.textContent.includes("Github")) {
            githubDiv = divElement
            break
          }
        }

        // If the "Github" div element is found, update the input value
        if (githubDiv) {
          const input = githubDiv.querySelector('input[type="text"]')
          if (input) {
            const updatedValue = data.data.github
            input.value = updatedValue
          }
        }
      }

      // Call the function to update the Github input value
      updateGithubInputValue()

      //update LinkedIn
      function updateLinkedinInputValue() {
        // Get the div elements containing the labels
        const divElements = document.querySelectorAll("#custom_fields > .field")

        // Find the div element with the "Linkedin" label
        let linkedinDiv
        for (const divElement of divElements) {
          const label = divElement.querySelector("label")
          if (label && label.textContent.includes("LinkedIn")) {
            linkedinDiv = divElement
            break
          }
        }

        // If the "LinkedIn" div element is found, update the input value
        if (linkedinDiv) {
          const input = linkedinDiv.querySelector('input[type="text"]')
          if (input) {
            const updatedValue = data.data.linkedin
            input.value = updatedValue
          }
        }
      }

      // Call the function to update the Linkedin input value
      updateLinkedinInputValue()

      //add gender
      function updateGender() {
        // Find the parent element with the ID "s2id_job_application_gender"
        const parentElement = document.getElementById(
          "s2id_job_application_gender"
        )

        // If the parent element is found
        if (parentElement) {
          // Find the child element with the class name "select2-chosen"
          const select2ChosenElement =
            parentElement.querySelector(".select2-chosen")

          // Update the child element's text content to a Selected Gender
          select2ChosenElement.textContent = data.data.gender
        }
      }

      // Call the function to update the DOM
      updateGender()

      //add "are you a latino"
      function youLatino() {
        // Find the parent element with the ID "  s2id_job_application_hispanic_ethnicity"
        const parentElement = document.getElementById(
          "s2id_job_application_hispanic_ethnicity"
        )

        // If the parent element is found
        if (parentElement) {
          // Find the child element with the class name "select2-chosen"
          const select2ChosenElement =
            parentElement.querySelector(".select2-chosen")

          // Update the child element's text content to a boolean
          select2ChosenElement.textContent = data.data.youlatino
        }
      }

      // Call the function to update the DOM
      youLatino()

      function updateVeteranStatus() {
        // Find the parent element with the ID "s2id_job_application_veteran_status"
        const parentElement = document.getElementById(
          "s2id_job_application_veteran_status"
        )

        // If the parent element is found
        if (parentElement) {
          // Find the child element with the class name "select2-chosen"
          const select2ChosenElement =
            parentElement.querySelector(".select2-chosen")

          // Update the child element's text content
          select2ChosenElement.textContent = data.data.veteranstatus
        }
      }

      // Call the function to update the DOM
      updateVeteranStatus()

      //add veteran status
      function disabilityStatus() {
        // Find the parent element with the ID "s2id_job_application_disability_status"
        const parentElement = document.getElementById(
          "s2id_job_application_disability_status"
        )

        // If the parent element is found
        if (parentElement) {
          // Find the child element with the class name "select2-chosen"
          const select2ChosenElement =
            parentElement.querySelector(".select2-chosen")

          // Update the child element's text content to a boolean
          select2ChosenElement.textContent = data.data.disabilitystatus
        }
      }

      // Call the function to update the DOM
      disabilityStatus()

      // website.value = data.data.website && data.data.website;
      const yes = await fetch(data.data.resume_url, {
        method: "GET",
        mode: "cors",
      })

      const red = await yes.blob()

      const myFile = new File([red], data.data.filename, {
        type: "application/pdf",
        lastModified: new Date(),
      })

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(myFile)
      const dec = document.querySelector(
        "#s3_upload_for_resume input[type='file']"
      )
      dec.files = dataTransfer.files

      const event = new Event("change")

      dec.dispatchEvent(event)
    } else window.open("https://instantapply.co", "_blank")
  }

  btn.addEventListener("click", function () {
    addFiles()
  })
}
