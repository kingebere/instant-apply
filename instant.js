//triggers  immediately after the page has been loaded
window.onload = () => {

    //adds the pdf to the file input field 
  async function addFiles() {

const phone= document.querySelector("input[name='job_application[phone]']")
const lastName= document.querySelector("input[name='job_application[last_name]']")
const firstName= document.querySelector("input[name='job_application[first_name]']")
const email= document.querySelector("input[name='job_application[email]']")
const github =document.querySelector("input[name='job_application[answers_attributes][1][text_value]']")
const website=document.querySelector("input[name='job_application[answers_attributes][2][text_value]']")
const linkedin=document.querySelector("input[name='job_application[answers_attributes][3][text_value]']")
phone.value="08089080471"
lastName.value="Dike"
firstName.value="Goodluck"
email.value="gudoski30@gmail.com"
github.value="kingebere"
website.value="https://uiland.design"
linkedin.value="https://linkedin.com/goodluck-dike"
    const yes = await fetch(
      "https://epcjufipobybxdmcqjgb.supabase.co/storage/v1/object/public/hbrs/DIKE-GOODLUCK%20RESUME-FEB-FRONTEND-2023.pdf?t=2023-04-07T14%3A34%3A25.472Z",
      { method: "GET", mode: "cors" }
    )

    const red = await yes.blob()

    const myFile = new File([red], "game.pdf", {
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
  }
  addFiles()
}
