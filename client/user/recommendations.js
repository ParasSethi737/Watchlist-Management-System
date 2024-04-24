document.addEventListener('DOMContentLoaded', function(){
    // Fetch data for all tables
    fetchAllData();
});


function fetchAllData() {
    // Fetch data for recommendations
    const recommendationsUrl = 'http://localhost:5000/getAll/recommendations';
    console.log('Fetching data for recommendations from:', recommendationsUrl);
    fetch(recommendationsUrl)
    .then(response => response.json())
    .then(data => loadHTMLTable(data, 'recommendations'));
}


// Function to load data into HTML table based on table name
function loadHTMLTable(data, tableName) {
    const table = document.querySelector(`#${tableName}-table tbody`);

    if (!data || !data.data || data.length === 0) {
        table.innerHTML = `<tr><td class="no-data" colspan="5">NO DATA</td></tr>`;
        return;
    }

    let tableHtml = "";
            data.data.forEach(function ({ id, from_user_id,to_user_id, movie_id, recommendation_type, created_at }) {
                tableHtml += "<tr>"
                tableHtml += `<td>${id}</td>`
                tableHtml += `<td>${from_user_id}</td>`
                tableHtml += `<td>${to_user_id}</td>`
                tableHtml += `<td>${movie_id}</td>`
                tableHtml += `<td>${recommendation_type}</td>`
                tableHtml += `<td>${created_at}</td>`
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

function handleInsertRow(tableName) {
    let newData = {};
            newData = {
                from_user_id: document.querySelector('#from-user-id-input').value.trim() || null,
                to_user_id: document.querySelector('#to-user-id-input').value.trim() || null,
                movie_id: document.querySelector('#movie-id-input').value.trim() || null,
                recommendation_type: document.querySelector('#recommendation-type-input').value.trim() || null
            };
    let fetchUrl = `http://localhost:5000/insert/${tableName}`;
    fetch(fetchUrl, {
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
            alert(`Data Successfully Inserted into ${tableName}`);
        }console.log(data);
    })
    .catch(error => {
        alert(error);
        console.log(data);
        console.log(newData);
        console.error('Error inserting data:', error);
    });
}

function deleteRowById(tableName, id) {
    let fetchUrl = `http://localhost:5000/delete/${tableName}/${id}`;
    fetch(fetchUrl, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchAllData(); 
            alert(`Data Successfully Deleted at ID:${id} in ${tableName}`);
        }
    });
}

function handleEditRow(tableName, id) {
//loads data into form for editing
    let fetchUrl = `http://localhost:5000/search/${tableName}/${id}`;
    if (tableName === 'movies') {fetchUrl = `http://localhost:5000/searchmovies/${id}`;}
    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            if (data && Object.keys(data).length > 0) {
                    loadRecommendationData(data);
            } else {
                console.error('Error: Failed to retrieve existing data for editing');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function loadRecommendationData(data) {
    const Data = data.data[0];
    document.querySelector('#recommendations-id-input').value = Data.id || '';
    document.querySelector('#from-user-id-input').value = Data.from_user_id || '';
    document.querySelector('#to-user-id-input').value = Data.to_user_id || '';
    document.querySelector('#movie-id-recommendation-input').value = Data.movie_id || '';
    document.querySelector('#recommendation-type-input').value = Data.recommendation_type || '';
}

function handleSubmit(tableName) {
// Updates data in table
    let updatedData = {};
    const id = document.querySelector(`#${tableName}-id-input`).value.trim();
            updatedData = {
                from_user_id: document.querySelector('#from-user-id-input').value.trim() || null,
                to_user_id: document.querySelector('#to-user-id-input').value.trim() || null,
                movie_id: document.querySelector('#movie-id-recommendation-input').value.trim() || null,
                recommendation_type: document.querySelector('#recommendation-type-input').value.trim() || null
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