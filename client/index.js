document.addEventListener('DOMContentLoaded', function(){
    // Fetch data for all tables
    fetchAllData();
});


function fetchAllData() {
    // Fetch data for users
    const usersUrl = 'http://localhost:5000/getAll/users';
    console.log('Fetching data for users from:', usersUrl);
    fetch(usersUrl)
    .then(response => response.json())
    .then(data => loadHTMLTable(data, 'users'));

    // Fetch data for recommendations
    const recommendationsUrl = 'http://localhost:5000/getAll/recommendations';
    console.log('Fetching data for recommendations from:', recommendationsUrl);
    fetch(recommendationsUrl)
    .then(response => response.json())
    .then(data => loadHTMLTable(data, 'recommendations'));

    // Fetch data for reviews
    const reviewsUrl = 'http://localhost:5000/getAll/reviews';
    console.log('Fetching data for reviews from:', reviewsUrl);
    fetch(reviewsUrl)
    .then(response => response.json())
    .then(data => loadHTMLTable(data, 'reviews'));

    // Fetch data for watchlist
    const watchlistUrl = 'http://localhost:5000/getAll/watchlist';
    console.log('Fetching data for watchlist from:', watchlistUrl);
    fetch(watchlistUrl)
    .then(response => response.json())
    .then(data => loadHTMLTable(data, 'watchlist'));

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
    switch (tableName) {
        case 'users':
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
            break;
        case 'recommendations':
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
            break;
        case 'reviews':
            data.data.forEach(function ({ id, user_id, movie_id,rating, comment }) {
                tableHtml += "<tr>"
                tableHtml += `<td>${id}</td>`
                tableHtml += `<td>${user_id}</td>`
                tableHtml += `<td>${movie_id}</td>`
                tableHtml += `<td>${rating}</td>`
                tableHtml += `<td>${comment}</td>`
                tableHtml += `<td><button class="${tableName}-edit-row-btn" data-id=${id}>Edit</td>`;
                tableHtml += `<td><button class="${tableName}-delete-row-btn" data-id=${id}>Delete</td>`;
                tableHtml += `<td><button class="${tableName}-insert-row-btn" data-id=${id}>Insert</td>`;
                tableHtml += "</tr>";
            });
            break;
        case 'watchlist':
            data.data.forEach(function ({ id, user_id, movie_id, added_at, status, rating }) {
                tableHtml += "<tr>"
                tableHtml += `<td>${id}</td>`
                tableHtml += `<td>${user_id}</td>`
                tableHtml += `<td>${movie_id}</td>`
                tableHtml += `<td>${status}</td>`
                tableHtml += `<td>${rating}</td>`
                tableHtml += `<td>${added_at}</td>`
                tableHtml += `<td><button class="${tableName}-edit-row-btn" data-id=${id}>Edit</td>`;
                tableHtml += `<td><button class="${tableName}-delete-row-btn" data-id=${id}>Delete</td>`;
                tableHtml += `<td><button class="${tableName}-insert-row-btn" data-id=${id}>Insert</td>`;
                tableHtml += "</tr>";
            });
            break;
        case 'movies':
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
            break;
        default:
            break;
    }    

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

    switch (tableName) {
        case 'users':
            newData = {
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
            break;
        case 'recommendations':
            newData = {
                from_user_id: document.querySelector('#from-user-id-input').value.trim() || null,
                to_user_id: document.querySelector('#to-user-id-input').value.trim() || null,
                movie_id: document.querySelector('#movie-id-input').value.trim() || null,
                recommendation_type: document.querySelector('#recommendation-type-input').value.trim() || null
            };
            break;            
        case 'reviews':
            newData = {
                user_id: document.querySelector('#user-id-review-input').value.trim() || null,
                movie_id: document.querySelector('#movie-id-review-input').value.trim() || null,
                rating: document.querySelector('#rating-review-input').value.trim() || null,
                comment: document.querySelector('#review-input').value.trim() || null
            };
            break;            
        case 'watchlist':
            newData = {
                user_id: document.querySelector('#user-id-watchlist-input').value.trim() || null,
                movie_id: document.querySelector('#movie-id-watchlist-input').value.trim() || null,
                status: document.querySelector('#status-input').value.trim() || null,
                rating: document.querySelector('#rating-watchlist-input').value.trim() || null
            };
            break; 
            case 'movies':
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
                break;
            
        default:
            console.error('Invalid table name');
            return;
    }
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
    fetch(`http://localhost:5000/delete/${tableName}/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchAllData(); 
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
                switch (tableName) {
                    case 'users':
                        loadUserData(data);
                        break;
                    case 'recommendations':
                        loadRecommendationData(data);
                        break;
                    case 'reviews':
                        loadReviewData(data);
                        break;
                    case 'watchlist':
                        loadWatchlistData(data);
                        break;
                    case 'movies':
                        loadMovieData(data);
                        break;
                    default:
                        console.error('Invalid table name');
                        break;
                }
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

function loadRecommendationData(data) {
    const Data = data.data[0];
    document.querySelector('#recommendations-id-input').value = Data.id || '';
    document.querySelector('#from-user-id-input').value = Data.from_user_id || '';
    document.querySelector('#to-user-id-input').value = Data.to_user_id || '';
    document.querySelector('#movie-id-recommendation-input').value = Data.movie_id || '';
    document.querySelector('#recommendation-type-input').value = Data.recommendation_type || '';
}

function loadReviewData(data) {
    const Data = data.data[0];
    document.querySelector('#reviews-id-input').value = Data.id || '';
    document.querySelector('#user-id-review-input').value = Data.user_id || '';
    document.querySelector('#movie-id-review-input').value = Data.movie_id || '';
    document.querySelector('#rating-review-input').value = Data.rating || '';
    document.querySelector('#review-input').value = Data.comment || '';
}

function loadWatchlistData(data) {
    const Data = data.data[0];
    document.querySelector('#watchlist-id-input').value = Data.id || '';
    document.querySelector('#user-id-watchlist-input').value = Data.user_id || '';
    document.querySelector('#movie-id-watchlist-input').value = Data.movie_id || '';
    document.querySelector('#status-input').value = Data.status || '';
    document.querySelector('#rating-watchlist-input').value = Data.rating || '';
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
    switch (tableName) {
        case 'users':
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
            break;
        case 'recommendations':
            updatedData = {
                from_user_id: document.querySelector('#from-user-id-input').value.trim() || null,
                to_user_id: document.querySelector('#to-user-id-input').value.trim() || null,
                movie_id: document.querySelector('#movie-id-recommendation-input').value.trim() || null,
                recommendation_type: document.querySelector('#recommendation-type-input').value.trim() || null
            };
            break;            
        case 'reviews':
            updatedData = {
                user_id: document.querySelector('#user-id-review-input').value.trim() || null,
                movie_id: document.querySelector('#movie-id-review-input').value.trim() || null,
                rating: document.querySelector('#rating-review-input').value.trim() || null,
                comment: document.querySelector('#review-input').value.trim() || null
            };
            break;            
        case 'watchlist':
            updatedData = {
                user_id: document.querySelector('#user-id-watchlist-input').value.trim() || null,
                movie_id: document.querySelector('#movie-id-watchlist-input').value.trim() || null,
                status: document.querySelector('#status-input').value.trim() || null,
                rating: document.querySelector('#rating-watchlist-input').value.trim() || null
            };
            break; 
            case 'movies':
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
                break;
            
        default:
            console.error('Invalid table name');
            return;
    }

    let fetchUrl = `http://localhost:5000/update/${tableName}/${id}`;
    if (tableName === 'movies') {fetchUrl = `http://localhost:5000/updateMovies/${id}`;}
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