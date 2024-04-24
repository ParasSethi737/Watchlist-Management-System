document.addEventListener('DOMContentLoaded', function(){
    fetchAllData();
});

function fetchAllData() {
    // Fetch data for users
    const usersUrl = 'http://localhost:5000/getAll/users';
    console.log('Fetching data for users from:', usersUrl);
    fetch(usersUrl)
    .then(response => response.json())
    .then(data => loadHTMLTable(data, 'users'));
}

function loadHTMLTable(data, tableName) {
    const table = document.querySelector(`#${tableName}-table tbody`);

    if (!data || !data.data || data.length === 0) {
        table.innerHTML = `<tr><td class="no-data" colspan="5">NO DATA</td></tr>`;
        return;
    }

    let tableHtml = "";
        data.data.forEach(function ({ id, username, email, first_name, last_name, birthdate, created_at, profile_picture, bio, country }) {
            tableHtml += "<tr>"
            tableHtml += `<td>${id}</td>`
            tableHtml += `<td>${username}</td>`
            tableHtml += `<td>${email}</td>`
            tableHtml += `<td>${first_name}</td>`
            tableHtml += `<td>${last_name}</td>`
            tableHtml += `<td>${birthdate}</td>`
            tableHtml += `<td>${created_at}</td>`
            tableHtml += `<td>${profile_picture}</td>`
            tableHtml += `<td>${bio}</td>`
            tableHtml += `<td>${country}</td>`
            tableHtml += `<td><button class="${tableName}-edit-row-btn" data-id=${id}>Edit</td>`;
            tableHtml += `<td><button class="${tableName}-delete-row-btn" data-id=${id}>Delete</td>`;
            tableHtml += `<td><button class="${tableName}-insert-row-btn" data-id=${id}>Insert</td>`;
            tableHtml += "</tr>";
        });    

    table.innerHTML = tableHtml;
    const editBtns = document.querySelectorAll(`.${tableName}-edit-row-btn`);
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            handleEditRow(tableName, id);
        });
    });

    const deleteBtns = document.querySelectorAll(`.${tableName}-delete-row-btn`);
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            deleteRowById(tableName, id);
        });
    });

    const insertBtns = document.querySelectorAll(`.${tableName}-insert-row-btn`);
    insertBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleInsertRow(tableName);
        });
    });

    const submitBtns = document.querySelectorAll(`#${tableName}-submit-btn`);
        submitBtns.forEach(btn => {
            btn.addEventListener('click', function(event) {
                event.preventDefault();
                handleSubmit(tableName);
            });
        });
}

function handleEditRow(tableName, id) {
    //loads data into form for editing
        let fetchUrl = `http://localhost:5000/search/${tableName}/${id}`;
        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    loadUserData(data);
                } else {
                    console.error('Error: Failed to retrieve existing data for editing');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

function loadUserData(data) {
    const Data = data.data[0];
    document.querySelector('#users-id-input').value = Data.id || '';
    document.querySelector('#username-input').value = Data.username || '';
    document.querySelector('#email-input').value = Data.email || '';
    document.querySelector('#password-hash-input').value = Data.password_hash || '';
    document.querySelector('#first-name-input').value = Data.first_name || '';
    document.querySelector('#last-name-input').value = Data.last_name || '';
    let formattedBirthdate = '';
    if (Data.birthdate && Data.birthdate.slice(0, 10) !== null) {
        formattedBirthdate = Data.birthdate.slice(0, 10);}
    document.querySelector('#birthdate-input').value = formattedBirthdate || '';
    document.querySelector('#profile-picture-input').value = Data.profile_picture || '';
    document.querySelector('#bio-input').value = Data.bio || '';
    document.querySelector('#country-input').value = Data.country || '';
}

function handleSubmit(tableName) {
    // Updates data in table
        let updatedData = {};
        const id = document.querySelector(`#${tableName}-id-input`).value.trim();
            updatedData = {
                username: document.querySelector('#username-input').value.trim() || null,
                email: document.querySelector('#email-input').value.trim() || null,
                password_hash: document.querySelector('#password-hash-input').value.trim() || null,
                first_name: document.querySelector('#first-name-input').value.trim() || null,
                last_name: document.querySelector('#last-name-input').value.trim() || null,
                birthdate: document.querySelector('#birthdate-input').value.trim() || null,
                profile_picture: document.querySelector('#profile-picture-input').value.trim() || null,
                bio: document.querySelector('#bio-input').value.trim() || null,
                country: document.querySelector('#country-input').value.trim() || null
            };
    
        let fetchUrl = `http://localhost:5000/update/${tableName}/${id}`;
        fetch(fetchUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
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
                alert(`Data Successfully Updated at ID:${id} in ${tableName}`);
            }console.log(data);
            console.log(updatedData);
        })
        .catch(error => {
            alert(error); 
            console.error('Error updating data:', error);
        });
    }