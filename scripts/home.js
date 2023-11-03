document.addEventListener('DOMContentLoaded', function () {
    const signin = document.querySelector('.home-signin');
    const signup = document.querySelector('.home-createaccount');
    signin.addEventListener('click', signIn);
    signup.addEventListener('click',signUp)
    function signIn(){
        window.location.href = 'login.html'; 
    }
    function signUp(){
        window.location.href = 'registration.html'; 
}
})

