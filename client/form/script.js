const form = document.getElementById('signupForm');
form.addEventListener('submit', function(event) {
    event.preventDefault();
    var username = form.elements.name.value;
    var email = form.elements.email.value;
    var password = form.elements.password.value;
    var confirmPassword = form.elements.confirmPassword.value;
    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill out all mandatory fields!');
    } else if (password.length < 8 || password.length > 20) {
        alert('Password must be between 8 to 20 characters long!');
    } else if (password !== confirmPassword) {
        alert('Passwords do not match!');
    }else if(username.length >18){
        alert('Username must be less than 18 character long!');
    } else {
        alert('Registered successfully!');
        form.submit();
    }
});

const chk = document.getElementById('chk');
chk.addEventListener('change', function() {
    const loginForm = document.querySelector('.login');
    const signupForm = document.querySelector('.signup');
    if (this.checked) {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
});

//on signupbtn click
const signupbtn = document.getElementById('signupBtn');
signupbtn.addEventListener('click', handleInsertRow);
function handleInsertRow(tableName) {
    let  newData = {
            username: document.querySelector('#name').value.trim() || null,
            email: document.querySelector('#email').value.trim() || null,
            password_hash: document.querySelector('#Password').value.trim() || null,
            first_name: document.querySelector('#firstName').value.trim() || null,
            last_name: document.querySelector('#lastName').value.trim() || null,
            birthdate: document.querySelector('#birthdate').value.trim() || null,
            profile_picture: document.querySelector('#profilePicture').value.trim() || null,
            bio: document.querySelector('#bio').value.trim() || null,
            country: document.querySelector('#country').value.trim() || null
        };
    fetch(`http://localhost:5000/insert/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            fetchAllData();
            alert(`Registered Successfully!`);
        }console.log(data);
    })
    .catch(error => {
        alert(error); 
        console.error('Error inserting data:', error);
    });
}

//on loginbtn click
const loginbtn = document.getElementById('loginBtn');
loginbtn.addEventListener('click', verifyUser);
function verifyUser() {
    loginData = {
        username: document.querySelector('#username').value.trim(),
        password_hash: document.querySelector('#password').value.trim()
    };
    fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            console.log(response);
            console.log(loginData);
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Login Successful!');
            window.location.href = '../index.html';
        } else {
            alert('Login failed!');
        }
    })
    .catch(error => {
        alert(error); 
        console.error('Error logging in:', error);
    });
}
