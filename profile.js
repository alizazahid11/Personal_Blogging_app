const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

const profileForm = document.getElementById("profile-form");
const photoInput = document.getElementById("photo-input");
const firstNameInput = document.getElementById("profile-name");
const passwordInput = document.getElementById("password-form");
const editNameIcon = document.getElementById("edit-icon");


// Function to update profile information
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Update profile photo
  const photoFile = photoInput.files[0];
  if (photoFile) {
    const storageRef = storage.ref(`profile_photos/${photoFile.name}`);
    await storageRef.put(photoFile);
    const photoUrl = await storageRef.getDownloadURL();
    // Update user's profile photo URL in the database
    // Example: You might use Firebase Firestore or Realtime Database
  }

  // Update first name, last name, and password
  const firstName = firstNameInput.value;
  // const lastName = lastNameInput.value;
  const newPassword = passwordInput.value;

  // Update user information in the database
  // Example: You might use Firebase Firestore or Realtime Database

  // Clear password input for security
  passwordInput.value = "";

  alert("Profile updated successfully!");
});

// Add an event listener to the edit name icon
editNameIcon.addEventListener("click", () => {
  // Show a form or modal for editing the name
  const newName = prompt("Enter your new name:");
  if (newName !== null) {
    // Update the displayed name and send it to the database
    firstNameInput.textContent = newName;
    // You should also send the new name to the database here
  }
});
const editPhotoIcon = document.getElementById("edit-photo");

// Add an event listener to the edit photo icon
editPhotoIcon.addEventListener("click", () => {
  // Create an input element for file upload
  const fileInput = document.createElement("input");
  fileInput.type = "file";

  // Add an event listener to the file input
  fileInput.addEventListener("change", async (event) => {
    const photoFile = event.target.files[0];

    if (photoFile) {
      const storageRef = storage.ref(`profile_photos/${photoFile.name}`);
      await storageRef.put(photoFile);
      const photoUrl = await storageRef.getDownloadURL();

      // Update the profile image source and send the new URL to the database
      photoInput.src = photoUrl;
      // You should also send the new photo URL to the database here
    }
  });

  // Trigger a click event on the file input to open the file selection dialog
  fileInput.click();
});
