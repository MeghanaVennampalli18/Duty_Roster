document.addEventListener('DOMContentLoaded', function () {
    const signin = document.querySelector('.register-signin');
    const signup = document.querySelector('.register-signup');
    signin.addEventListener('click', signIn);
    signup.addEventListener('click',signUp);
    function signIn() {
        window.location.href = 'login.html';
    };
    
    function signUp() {
        const userData = {
            username: document.querySelector('.register-username').value,
            email: document.querySelector('.register-email').value,
            password: document.querySelector('.register-password').value,
            confirmpassword: document.querySelector('.register-confirmpass').value
        };
    
        console.log(userData)
        fetch('http://127.0.0.1:8000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => {
            console.log(response)
            if (!response.ok) {
                if (userData.username === '' || userData.email === '' || userData.password === '') {
                    return alert('fill all details!!')
                    }   
                else if (userData.password !== userData.confirmpassword){
                    return alert('password mismatch!!')
                }     
                else{
                    alert('Details in correct format!!');
                    throw new Error('Network response was not ok');
                }   
            }
            else{
                alert('Registered Successfully!!')
                return response.json();
            }
            // console.log(response)
            // if (userData.username === '' || userData.email === '' || userData.password === '') {
            //     return alert('fill all details')
            // }
            // else{
            //     alert('Registered Successfully!!')
            //     return response.json()
            // } 
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error', error);
        });
    }
})
