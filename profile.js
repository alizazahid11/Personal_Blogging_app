const storage = firebase.storage();

const profileContainer = document.querySelector(".profile-container");
const profileImage = profileContainer.querySelector(".profile-image");
const editProfileNameIcon = profileContainer.querySelector(".profile-name .edit-icon");
const passwordForm = profileContainer.querySelector(".password-form");
const updatePasswordButton = profileContainer.querySelector(".update-button");

// Function to update profile photo
profileImage.addEventListener("change", async (e) => {
  const photoFile = e.target.files[0];
  if (photoFile) {
    const storageRef = storage.ref(`profile_photos/${photoFile.name}`);
    await storageRef.put(photoFile);
    const photoUrl = await storageRef.getDownloadURL();
    // Update user's profile photo URL in the database
    // Example: You might use Firebase Firestore or Realtime Database
  }
});

// Function to toggle profile name editing
editProfileNameIcon.addEventListener("click", () => {
  // Toggle the editing state of the profile name
  // You might implement the editing functionality here
});

// Function to update password
updatePasswordButton.addEventListener("click", () => {
  const oldPassword = passwordForm[0].value;
  const newPassword = passwordForm[1].value;
  const repeatPassword = passwordForm[2].value;

  // Validate oldPassword, newPassword, and repeatPassword
  // Update user's password using Firebase Authentication or other methods
});
