document.addEventListener("DOMContentLoaded", () => {
  const generateEmailBtn = document.getElementById("generateEmailBtn");
  const checkMailboxBtn = document.getElementById("checkMailboxBtn");
  const generatedEmailElement = document.getElementById("generatedEmail");
  const emailContainer = document.getElementById("emailContainer");
  const emailsListElement = document.getElementById("emails");
  const emailDetailsElement = document.getElementById("emailDetails");
  const emailFromElement = document.getElementById("emailFrom");
  const emailSubjectElement = document.getElementById("emailSubject");
  const emailDateElement = document.getElementById("emailDate");
  const emailBodyElement = document.getElementById("emailBody");
  let generatedEmail = "";
  let emailParts = [];

  const apiBaseUrl = "https://www.1secmail.com/api/v1/";

  // Function to generate a random email address
  async function generateRandomEmail() {
    try {
      const response = await fetch(
        `${apiBaseUrl}?action=genRandomMailbox&count=1`
      );
      const emails = await response.json();
      if (emails.length > 0) {
        generatedEmail = emails[0];
        generatedEmailElement.textContent = generatedEmail;
        emailContainer.classList.remove("hidden");
        emailParts = generatedEmail.split("@");
      }
    } catch (error) {
      console.error("Error generating email:", error);
    }
  }

  // Function to check the mailbox for received emails
  async function checkMailbox() {
    if (!generatedEmail) return;
    try {
      const response = await fetch(
        `${apiBaseUrl}?action=getMessages&login=${emailParts[0]}&domain=${emailParts[1]}`
      );
      const emails = await response.json();
      emailsListElement.innerHTML = "";
      emailDetailsElement.classList.add("hidden");
      if (emails.length > 0) {
        emailsListElement.parentElement.classList.remove("hidden");
        emails.forEach((email) => {
          const li = document.createElement("li");
          li.textContent = `${email.subject} - From: ${email.from}`;
          li.addEventListener("click", () => fetchEmailDetails(email.id));
          emailsListElement.appendChild(li);
        });
      } else {
        emailsListElement.parentElement.classList.add("hidden");
        alert("No emails found!");
      }
    } catch (error) {
      console.error("Error checking mailbox:", error);
    }
  }

  // Function to fetch email details
  async function fetchEmailDetails(emailId) {
    try {
      const response = await fetch(
        `${apiBaseUrl}?action=readMessage&login=${emailParts[0]}&domain=${emailParts[1]}&id=${emailId}`
      );
      const emailDetails = await response.json();
      emailFromElement.textContent = emailDetails.from;
      emailSubjectElement.textContent = emailDetails.subject;
      emailDateElement.textContent = emailDetails.date;
      emailBodyElement.textContent = emailDetails.body;
      emailDetailsElement.classList.remove("hidden");
    } catch (error) {
      console.error("Error fetching email details:", error);
    }
  }

  generateEmailBtn.addEventListener("click", generateRandomEmail);
  checkMailboxBtn.addEventListener("click", checkMailbox);
});
