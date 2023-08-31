// // Detect changes in user authentication state
// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       // User is signed in, fetch and display the user's username
//       fetchUsernameFromDatabase(user.uid).then(function(username) {
//         document.getElementById("nav-user").innerHTML = username;
//       }).catch(function(error) {
//         console.error("Error fetching username:", error);
//         document.getElementById("nav-user").innerHTML = "Guest";
//       });
//     } else {
//       // User is signed out, update the navigation bar accordingly
//       document.getElementById("nav-user").innerHTML = "Guest";
//     }
//   });
  
//   // Function to fetch the user's username from the Realtime Database
//   function fetchUsernameFromDatabase(uid) {
//     return firebase.database().ref('users/' + uid).once('value').then(function(snapshot) {
//       return snapshot.val().username;
//     });
//   }


  // Reference to Firestore collection
// const blogsRef = firebase.firestore().collection('blog-post');

// // Function to publish a blog
// function publishBlog() {
//     const title = document.getElementById('blog-title').value;
//     const description = document.getElementById('blog-description').value;

//     // Add the blog to Firestore
//     blogsRef.add({
//         title: title,
//         description: description
//     }).then(() => {
//         console.log('Blog published successfully.');
//         // Clear the form fields
//         document.getElementById('blog-title').value = '';
//         document.getElementById('blog-description').value = '';
//         // Fetch and display blogs
//         fetchAndDisplayBlogs();
//     }).catch(error => {
//         console.error('Error publishing blog:', error);
//     });
// }

// // Function to fetch and display blogs
// function fetchAndDisplayBlogs() {
//     blogsRef.get().then(querySnapshot => {
//         const blogsContainer = document.getElementById('blogs-container');
//         blogsContainer.innerHTML = ''; // Clear previous content
//    // In the fetchAndDisplayBlogs function
// querySnapshot.forEach(doc => {
//     const blogData = doc.data();
//     const blogElement = document.createElement('div');
//     blogElement.classList.add('blog-post');
//     blogElement.innerHTML = `
//         <h2>${blogData.title}</h2>
//         <p>${blogData.description}</p>
//     `;
//     blogsContainer.appendChild(blogElement);
// });
//     }).catch(error => {
//         console.error('Error fetching blogs:', error);
//     });
// }
// function publishBlog() {
//     const title = document.getElementById('blog-title').value;
//     const description = document.getElementById('blog-description').value;

//     // Create a new blog post element
//     const blogPost = document.createElement('div');
//     blogPost.classList.add('blog-post');
//     blogPost.innerHTML = `
//         <h2>${title}</h2>
//         <p>${description}</p>
//     `;

//     // Append the blog post to the container
//     const blogsContainer = document.getElementById('blogs-container');
//     blogsContainer.appendChild(blogPost);

//     // Clear the input fields
//     document.getElementById('blog-title').value = '';
//     document.getElementById('blog-description').value = '';
// }

// // Attach the event listener after DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('publish-button').addEventListener('click', publishBlog);
// });

const app = firebase.initializeApp(firebaseConfig);

const loggedInUser = {
  fullName: "John Doe",
  id: "user123", // Replace with actual user ID
};

const database = firebase.database();
const blogsRef = database.ref("blogs");

const userFullNameElement = document.getElementById("userFullName");
const blogForm = document.getElementById("blogForm");
const blogPostsElement = document.getElementById("blogPosts");

// Listen for data changes using the "value" event
blogsRef.on("value", (snapshot) => {
  const blogsData = snapshot.val();
  console.log("blogsData:", blogsData); // Log the blogsData object
  if (blogsData) {
  // Convert the object into an array of values
  const blogPosts = Object.values(blogsData);

  // Clear previous content
  blogPostsElement.innerHTML = "";

  // Render blog posts
  blogPosts.forEach((post) => {
    const blogDiv = document.createElement("div");
    blogDiv.classList.add("blog");
    blogDiv.innerHTML = `
      <div class="div-post">
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        <p><em>Published on: ${post.date}</em></p>
        <button class="updateBtn">Update</button>
        <button class="deleteBtn">Delete</button>
      </div>`;
    blogPostsElement.appendChild(blogDiv);

    const deleteBtn = blogDiv.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this blog?"
      );
      if (confirmDelete) {
        // Delete logic here
        alert("Blog deleted");
      }
    });

    const updateBtn = blogDiv.querySelector(".updateBtn");
    updateBtn.addEventListener("click", () => {
      // Update logic here
      alert("Update button clicked");
    });
  });
} else {
    // Handle the case where blogsData is null or undefined
    console.warn("No blog data found.");
    blogPostsElement.innerHTML = "No blog data found.";
  }
});

// Submit blog form
blogForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const blogTitle = document.getElementById("blogTitle").value;
  const blogBody = document.getElementById("blogBody").value;
  const currentDate = new Date().toISOString().split("T")[0];

  const newBlogPost = {
    title: blogTitle,
    body: blogBody,
    date: currentDate,
  };

  try {
    const docRef = await blogsRef.push(newBlogPost);
    newBlogPost.id = docRef.key;

    // Clear form fields
    blogForm.reset();
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});
document.addEventListener('DOMContentLoaded', function() {
// Select the publish button element
const publishButton = document.getElementById('publish-button');

if (publishButton) {
    console.log("Adding event listener to publishButton.");
    publishButton.addEventListener('click', publishBlog);
} else {
    console.error("Publish button not found.");
}
// Function to publish a blog
function publishBlog() {
    const title = document.querySelector('.form-input').value;
    const description = document.querySelector('.description-box').value;
    const currentDate = new Date().toISOString().split("T")[0];

    const newBlogPost = {
      title: title,
      body: description,
      date: currentDate,
    };

    // Add the new blog post to Firebase
    blogsRef.push(newBlogPost)
      .then(() => {
        console.log('Blog published successfully.');
        // Clear the form fields
        document.querySelector('.form-input').value = '';
        document.querySelector('.description-box').value = '';

        // Update the UI by fetching and displaying the blogs
        fetchAndDisplayBlogs();
      })
      .catch(error => {
        console.error('Error publishing blog:', error);
      });
}
});
// let stored = sessionStorage.getItem('userName');/
let storedUsername = sessionStorage.getItem('user')
console.log('storedUsername', storedUsername);
let userElement = document.getElementById('username');
// userElement.innerHTML = JSON.parse(storedUsername).username;
// // console.log(storedUsername);
try {
    if (storedUsername) {
      const user = JSON.parse(storedUsername);
      userElement.innerHTML = user.username;
    } else {
      userElement.innerHTML = "Guest"; // Default if no user data is stored
    }
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    userElement.innerHTML = "Guest"; // Default if there's an error
  }