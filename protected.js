function isAuthenticated() {
    const user = sessionStorage.getItem('user');
    return user !== null;
}


if (!isAuthenticated()) {
    window.location.href = './login.html' ;
}

const logout = () => {
    sessionStorage.removeItem('user');
    console.log()
    window.location.href='./index.html'
}