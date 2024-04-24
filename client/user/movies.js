document.addEventListener('DOMContentLoaded', function(){
    fetchAllData();
});


function fetchAllData() {
    // Fetch data for movies and related tables
    const moviesUrl = 'http://localhost:5000/getAllMovies';
    console.log('Fetching data for movies from:', moviesUrl);
    fetch(moviesUrl)
    .then(response => response.json())
    .then(data => loadHTMLTable(data, 'movies'));
}


// Function to load data into HTML table based on table name
function loadHTMLTable(data, tableName) {
    const table = document.querySelector(`#${tableName}-table tbody`);

    if (!data || !data.data || data.length === 0) {
        table.innerHTML = `<tr><td class="no-data" colspan="5">NO DATA</td></tr>`;
        return;
    }

    let tableHtml = "";
        data.data.forEach(function ({ id, title, release_date,vote_average, vote_count, popularity, overview,
            budget , revenue, runtime, tagline, genres, original_languages, production_companies }) {
            tableHtml += "<tr>"
            tableHtml += `<td>${id}</td>`
            tableHtml += `<td>${title}</td>`
            tableHtml += `<td>${genres}</td>`
            tableHtml += `<td>${release_date}</td>`
            tableHtml += `<td>${runtime}</td>`
            tableHtml += `<td>${overview}</td>`
            tableHtml += `<td>${tagline}</td>`
            tableHtml += `<td>${vote_average}</td>`
            tableHtml += `<td>${vote_count}</td>`
            tableHtml += `<td>${popularity}</td>`
            tableHtml += `<td>${revenue}</td>`
            tableHtml += `<td>${budget}</td>`
            tableHtml += `<td>${production_companies}</td>`
            tableHtml += `<td>${original_languages}</td>`
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
                title: document.querySelector('#title-input').value.trim() || null,
                genres: document.querySelector('#genres-input').value.trim() || null,
                release_date: document.querySelector('#release-date-input').value.trim() || null,
                runtime: document.querySelector('#runtime-input').value.trim() || null,
                overview: document.querySelector('#overview-input').value.trim() || null,
                tagline: document.querySelector('#tagline-input').value.trim() || null,
                vote_average: document.querySelector('#vote-average-input').value.trim() || null,
                vote_count: document.querySelector('#vote-count-input').value.trim() || null,
                popularity: document.querySelector('#popularity-input').value.trim() || null,
                revenue: document.querySelector('#revenue-input').value.trim() || null,
                budget: document.querySelector('#budget-input').value.trim() || null,
                production_companies: document.querySelector('#production-companies-input').value.trim() || null,
                original_language: document.querySelector('#original-language-input').value.trim() || null
            };
    let fetchUrl = `http://localhost:5000/insert/${tableName}`;
    if (tableName === 'movies') {fetchUrl = `http://localhost:5000/insertmovies`;}
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
    let fetchUrl = `http://localhost:5000/deletemovies/${id}`;
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
    let fetchUrl = `http://localhost:5000/searchmovies/${id}`;
    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            if (data && Object.keys(data).length > 0) {
                    loadMovieData(data);
            } else {
                console.error('Error: Failed to retrieve existing data for editing');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function loadMovieData(data) {
    const Data = data.data[0];
    document.querySelector('#movies-id-input').value = Data.id || '';
    document.querySelector('#title-input').value = Data.title || '';
    document.querySelector('#genres-input').value = Data.genres || '';
    document.querySelector('#release-date-input').value = Data.release_date || '';
    document.querySelector('#runtime-input').value = Data.runtime || '';
    document.querySelector('#overview-input').value = Data.overview || '';
    document.querySelector('#tagline-input').value = Data.tagline || '';
    document.querySelector('#vote-average-input').value = Data.vote_average || '';
    document.querySelector('#vote-count-input').value = Data.vote_count || '';
    document.querySelector('#popularity-input').value = Data.popularity || '';
    document.querySelector('#revenue-input').value = Data.revenue || '';
    document.querySelector('#budget-input').value = Data.budget || '';
    document.querySelector('#production-companies-input').value = Data.production_companies || '';
    document.querySelector('#original-language-input').value = Data.original_languages || '';
}

function handleSubmit(tableName) {
// Updates data in table
    let updatedData = {};
    const id = document.querySelector(`#${tableName}-id-input`).value.trim();
            updatedData = {
                title: document.querySelector('#title-input').value.trim() || null,
                genres: document.querySelector('#genres-input').value.trim() || null,
                release_date: document.querySelector('#release-date-input').value.trim() || null,
                runtime: document.querySelector('#runtime-input').value.trim() || null,
                overview: document.querySelector('#overview-input').value.trim() || null,
                tagline: document.querySelector('#tagline-input').value.trim() || null,
                vote_average: document.querySelector('#vote-average-input').value.trim() || null,
                vote_count: document.querySelector('#vote-count-input').value.trim() || null,
                popularity: document.querySelector('#popularity-input').value.trim() || null,
                revenue: document.querySelector('#revenue-input').value.trim() || null,
                budget: document.querySelector('#budget-input').value.trim() || null,
                production_companies: document.querySelector('#production-companies-input').value.trim() || null,
                original_language: document.querySelector('#original-language-input').value.trim() || null
            };

    let fetchUrl = `http://localhost:5000/updateMovies/${id}`;
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