
const app = firebase.initializeApp(firebaseConfig);


let username = "";
const database = firebase.database();
const blogsRef = database.ref("blogs");

const userFullNameElement = document.getElementById("userFullName");
const blogForm = document.getElementById("blogForm");
const blogPostsElement = document.getElementById("blogPosts");
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, you can now update their password or perform other actions
    // Load the user's name from the database and update the profile name element
    const userId = user.uid;
    const userElement = document.getElementById('username');
    const profilePicElement = document.getElementById('blog-image');

    // Retrieve the user's name from the database
    database.ref(`users/${userId}/username`).once('value')
      .then((snapshot) => {
        const username = snapshot.val();
        if (username) {
          // Update the displayed name
          userElement.textContent = username;
        }
      })
      .catch((error) => {
        console.error("Error fetching username: " + error.message);
      });
        // Retrieve the profile picture URL from sessionStorage
    const profilePicURL = sessionStorage.getItem('profilePictureURL');
    if (profilePicURL) {
      // Display the profile picture
      profilePicElement.src = profilePicURL;
    }
  }
else {
    // User is not signed in, handle this case accordingly
  }
});


// Listen for data changes using the "value" event
blogsRef.on("value", async (snapshot) => {
  const blogsData = snapshot.val();
  console.log("blogsData:", blogsData); // Log the blogsData object
  if (blogsData) {
    // Convert the object into an array of values
    const blogPosts = Object.values(blogsData);

    // Clear previous content
    blogPostsElement.innerHTML = "";

    // Render blog posts
    for (const post of blogPosts) {
      const blogDiv = document.createElement("div");
      blogDiv.classList.add("blog");

      // Retrieve the user's name from the database
      const userId = post.userId; // Assuming you have a userId in your post data
      const usernameSnapshot = await database.ref(`users/${userId}/username`).once('value');
      const username = usernameSnapshot.val();

   
      blogDiv.innerHTML = `
        <div class="div-post">
       
         <h3>${post.title}</h3>
        
        <p><em><b>${post.date}</b></em></p>
          <p>${post.body}</p>

          <button class="deleteBtn" style="color:purple; border:none;background-color: transparent;cursor:pointer;">Delete</button>
          <button class="updateBtn" style="color:purple; border:none;background-color: transparent;cursor:pointer;">Edit</button>
        </div>`;
        
      blogPostsElement.appendChild(blogDiv);

      const deleteBtn = blogDiv.querySelector(".deleteBtn");
      deleteBtn.addEventListener("click", () => {
        const confirmDelete = confirm("Are you sure you want to delete this blog?");
        if (confirmDelete) {
          alert("BLOG DELETED");
        }
      });

      const updateBtn = blogDiv.querySelector(".updateBtn");
      updateBtn.addEventListener("click", () => {
        // Update logic here
        alert("Update button clicked");
      });
    }
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



// let stored = sessionStorage.getItem('userName');/
let storedUsername = sessionStorage.getItem('user');

console.log('storedUsername', storedUsername);
let userElement = document.getElementById('username');
// userElement.innerHTML = JSON.parse(storedUsername).username;
// // console.log(storedUsername);
document.addEventListener('DOMContentLoaded', function() {
    const userElement = document.getElementById('username');
    const publishButton = document.getElementById('publish-button');
  
    if (userElement) {
      let storedUsername = sessionStorage.getItem('user');
      console.log('storedUsername', storedUsername);
  
try {
    if (storedUsername) {
      const user = JSON.parse(storedUsername);
      console.log('Parsed user:', user);
      userElement.innerHTML = user.username;
      userElement.setAttribute("data-username", user.username); 
    } else {
      userElement.innerHTML = "Guest"; // Default if no user data is stored
      userElement.setAttribute("data-username", "Guest");
    }
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    userElement.innerHTML = "Guest"; // Default if there's an error
    userElement.setAttribute("data-username", "Guest"); 
  }
} else {
    console.error("Username element not found.");
  }
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