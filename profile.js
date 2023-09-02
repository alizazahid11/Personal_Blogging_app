
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const database = firebase.database(); // Reference to Firebase Realtime Database


// Check user's sign-in status on page load
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, you can now update their password or perform other actions
    // Load the user's name from the database and update the profile name element
    const userId = user.uid;
    const profileNameElement = document.getElementById('profile-name');

    // Retrieve the user's name from the database
    database.ref(`users/${userId}/username`).once('value')
      .then((snapshot) => {
        const username = snapshot.val();
        if (username) {
          // Update the displayed name
          profileNameElement.textContent = username;
        }
      })
      .catch((error) => {
        console.error("Error fetching username: " + error.message);
      });
  } else {
    // User is not signed in, handle this case accordingly
  }
});


const profileForm = document.getElementById("profile-form");
const photoInput = document.getElementById("photo-input");
const firstNameInput = document.getElementById("profile-name");
const passwordInput = document.getElementById("password-form");
const editNameIcon = document.getElementById("edit-icon");
const editPhotoIcon = document.getElementById("edit-photo");
const repeatPasswordInput = document.getElementById("repeat-password-form");
const errorMessage = document.getElementById("error-message");
// Add an event listener to the edit name icon


// Function to update profile information
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Check if the new password and repeat password match
  const newPassword = passwordInput.value;
  const repeatPassword = repeatPasswordInput.value;
  
  if (newPassword !== repeatPassword) {
    // Display an error message
    errorMessage.textContent = "New password and repeat password do not match.";
    alert("Passwords don't match!");
    return; // Prevent further execution
  } else {
    // Clear any previous error message
    errorMessage.textContent = "";
  }

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

  // Update user information in the database
  const user = firebase.auth().currentUser;
  if (user) {
    const userId = user.uid;

    // Update the password and repeatPassword in the Realtime Database
    database.ref(`users/${userId}`).update({
      newpassword: newPassword,
      repeatnewPass: repeatPassword,
      // Add other user information here if needed
    });

    // Clear password input for security
    passwordInput.value = "";
    repeatPasswordInput.value = "";

    alert("Profile updated successfully!");
  } else {
    alert("User is not signed in.");
  }
});

// // Add an event listener to the edit name icon
// editNameIcon.addEventListener("click", () => {
//   // Show a form or modal for editing the name
//   const newName = prompt("Enter your new name:");
//   if (newName !== null) {
//     // Update the displayed name and send it to the database
//     firstNameInput.textContent = newName;
//     // You should also send the new name to the database here
//   }
// });
// Add an event listener to the edit name icon
// editNameIcon.addEventListener("click", () => {
//   // Show a form or modal for editing the name
//   const newName = prompt("Enter your new name:");
//   if (newName !== null) {
//     // Update the displayed name
//     firstNameInput.value = newName;

//     // Update the new name in the Realtime Database
//     const user = firebase.auth().currentUser;
//     if (user) {
//       const userId = user.uid;

//       // Update the name in the Realtime Database
//       firebase.database().ref(`users/${userId}`).update({
//         username: newName, // Assuming 'username' is the field in your database for storing the name
//       })
//       .then(() => {
//         alert("Name updated successfully!");
//       })
//       .catch((error) => {
//         alert("Error updating name: " + error.message);
//       });
//     } else {
//       alert("User is not signed in.");
//     }
//   }
// });

// // Add an event listener to the edit name icon
// editNameIcon.addEventListener("click", () => {
//   // Show a form or modal for editing the name
//   const newName = prompt("Enter your new name:");
//   if (newName !== null) {
//     // Update the displayed name
//     firstNameInput.value = newName;

//     // Update the new name in the Realtime Database
//     const user = firebase.auth().currentUser;
//     if (user) {
//       const userId = user.uid;

//       // Update the name in the Realtime Database
//       firebase.database().ref(`users/${userId}`).update({
//         username: newName, // Assuming 'username' is the field in your database for storing the name
//       })
//       .then(() => {
//         alert("Name updated successfully!");
       
//         // Update the displayed name with the new name
//         firstNameInput.value = newName;
      
//       })
//       .catch((error) => {
//         alert("Error updating name: " + error.message);
//       });
//     } else {
//       alert("User is not signed in.");
//     }
//   }
// });
// Add an event listener to the edit name icon
editNameIcon.addEventListener("click", () => {
  // Show a form or modal for editing the name
  const newName = prompt("Enter your new name:");
  if (newName !== null) {
    // Update the displayed name
    firstNameInput.value = newName;

    // Update the new name in the Realtime Database
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;

      // Update the name in the Realtime Database
      firebase.database().ref(`users/${userId}`).update({
        username: newName, // Assuming 'username' is the field in your database for storing the name
      })
      .then(() => {
        alert("Name updated successfully!");

        // Update the displayed name with the new name
        const profileNameElement = document.getElementById('profile-name');
        if (profileNameElement) {
          profileNameElement.textContent = newName;
        }
      })
      .catch((error) => {
        alert("Error updating name: " + error.message);
      });
    } else {
      alert("User is not signed in.");
    }
  }
});


// Add an event listener to the edit photo icon
editPhotoIcon.addEventListener("click", () => {
  // Create an input element for file upload
  const fileInput = document.createElement("input");
  fileInput.type = "file";

  // Add an event listener to the file input
  fileInput.addEventListener("change", (event) => {
    const photoFile = event.target.files[0];

    if (photoFile) {
      // Read the selected image file and display it in the browser
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target.result;
        photoInput.src = newImageUrl;
      };
      reader.readAsDataURL(photoFile);

      // You can also update the profile image in the database here
    }
  });

  // Trigger a click event on the file input to open the file selection dialog
  fileInput.click();
});

const updatePasswordButton = document.querySelector(".update-button");

updatePasswordButton.addEventListener("click", async () => {
  // Get the new password input value
  const newPassword = document.querySelector("input[type='password'][placeholder='New Password']").value;

  // Check if the user is signed in
  const user = firebase.auth().currentUser;
  if (user) {
    try {
      // Update the password
      await user.updatePassword(newPassword);

      // Update the password and repeatPassword in the Realtime Database
      const userId = user.uid;
      database.ref(`users/${userId}`).update({
        newpassword: newPassword,
        repeatnewPass: newPassword, // Update repeatPassword to match newPassword
        // Add other user information here if needed
      });

      alert("Password updated successfully!");
    } catch (error) {
      alert("Error updating password: " + error.message);
    }
  } else {
    alert("User is not signed in.");
  }
});
