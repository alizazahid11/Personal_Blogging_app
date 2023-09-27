
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
    const profilePictureElement = document.getElementById('photo-input'); // Assuming you have an image element for displaying the profile picture

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

    // Retrieve the profile picture URL from sessionStorage
    const profilePictureURL = sessionStorage.getItem('profilePictureURL');
    if (profilePictureURL) {
      // Display the profile picture
      profilePictureElement.src = profilePictureURL;
    }
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
  fileInput.addEventListener("change", async (event) => {
    const photoFile = event.target.files[0];

    if (photoFile) {
      try {
        // Create a storage reference to the profile photo using the user's UID as the filename
        const storageRef = storage.ref(`profile_photos/${firebase.auth().currentUser.uid}`);
        
        // Upload the selected image file to Firebase Storage
        const uploadTask = storageRef.put(photoFile);

        // Listen for state changes, errors, and completion of the upload
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress (if needed)
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% complete`);
          },
          (error) => {
            // Handle unsuccessful uploads (if needed)
            console.error("Error uploading profile photo: ", error);
          },
          async () => {
            // Handle successful upload
            console.log("Profile photo uploaded successfully");
            
            // Get the download URL for the uploaded image
            const downloadURL = await storageRef.getDownloadURL();

            // Update the user's profile photo URL in your Firebase Realtime Database
            const user = firebase.auth().currentUser;
            if (user) {
              const userId = user.uid;

              // Update the profile photo URL in the Realtime Database
              database.ref(`users/${userId}`).update({
                profilePhotoURL: downloadURL, // Store the download URL in the database
              });

              // Update the displayed profile photo (if needed)
              photoInput.src = downloadURL;
              sessionStorage.setItem('profilePictureURL', downloadURL);
              
              alert("Profile photo updated successfully!");
            } else {
              alert("User is not signed in.");
            }
          }
        );
      } catch (error) {
        console.error("Error handling profile photo: " + error.message);
      }
    }
  });

  // Trigger a click event on the file input to open the file selection dialog
  fileInput.click();
});

const updatePasswordButton = document.querySelector(".update-button");

updatePasswordButton.addEventListener("click", async () => {
  // Get the new password input value
  // const newPassword = document.querySelector("input[type='password'][placeholder='New Password']").value;
  const newPasswordInput = document.querySelector("input[type='password'][placeholder='New Password']");
  const newPassword = newPasswordInput.value;

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

  // Clear the input fields after a successful update
  newPasswordInput.value = "";
  document.querySelector("input[type='password'][placeholder='Old Password']").value = "";
  document.querySelector("input[type='password'][placeholder='Repeat Password']").value = "";
      alert("Password updated successfully!");
    } catch (error) {
      alert("Error updating password: " + error.message);
    }
  } else {
    alert("User is not signed in.");
  }
});

