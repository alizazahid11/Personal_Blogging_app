function isAuthenticated() {
    const user = sessionStorage.getItem('user');
    return user !== null;
}

// Check if the user is authenticated
if (!isAuthenticated()) {
    window.location.href = './salessignin.html' ;
}

const logout = () => {
    sessionStorage.removeItem('user');
    console.log()
    window.location.href='./index.html'
}