document.addEventListener('DOMContentLoaded', function () {
    const signin = document.querySelector('.login-signin');
    const signup = document.querySelector('.login-signup');
    signin.addEventListener('click', signIn);
    signup.addEventListener('click',signUp)
    function signIn() {
        const userData = {
            email: document.querySelector('.login-username').value,
            password: document.querySelector('.login-password').value
        };
        if (userData.email === '' || userData.password === '') {
            return alert('Please fill in all details.');
        }
        fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => {
            if (!response.ok) {
                alert('invalid credentails');
                throw new Error('Network response was not ok');
            }
            else{
                return response.json();
            }
        })
        .then(data => {
            const token = data.jwt;
            localStorage.setItem('token', token);
            window.location.href = 'todo.html'; 
        })    
            
    
        // .then(data => {
        //     if (data && data.error) {
        //         console.error('Error:', data.error);
        //     } else if (data && data.isAuthenticated) {
        //         console.log('User logged in successfully.');
        //         window.location.href = 'todo.html';
        //     } else {
        //         console.error('Invalid username or password. Please try again.');
        //     }
        // })
    
    
        // .then(response => {
        //     console.log(response)
        //     if (userData.email === '' || userData.password === '') {
        //         alert('fill all details')
        //     }
        //     else{
        //         window.location.href = 'todo.html';
        //         return response.json()
        //     }   
            
        // })
        // .then(data => {
        //     console.log(data);
        //     console.log('User logged in successfully.');
        //     window.location.href = 'todo.html';
        // })
        .catch(error => {
            console.error('Error', error);
        });
    }
    
    function signUp() {
        console.log('success');
        window.location.href = 'registration.html';
    }
})
