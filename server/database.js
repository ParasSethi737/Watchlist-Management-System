const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
//names must be the same as in the database
dotenv.config();

class DbService {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async getAllData(table) {
        const query = `SELECT * FROM ${table};`;
        const [rows] = await this.pool.execute(query);
        return rows;
    }
    
    async insertUsersData(userData) {
        const { username, email, password_hash, first_name, last_name, birthdate, profile_picture, bio, country } = userData;
        const query = `INSERT INTO users (username, email, password_hash, first_name, last_name, birthdate, profile_picture, bio, country)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        const params = [username, email, password_hash, first_name, last_name, birthdate, profile_picture, bio, country];
    
        const [result] = await this.pool.execute(query, params);
        return result;
    }
    
    async insertReviewsData(reviewData) {
        const { user_id, movie_id, rating, comment } = reviewData;
        const query = `INSERT INTO Reviews (user_id, movie_id, rating, comment)
                       VALUES (?, ?, ?, ?);`;
        const [result] = await this.pool.execute(query, [user_id, movie_id, rating, comment]);
        return result.affectedRows === 1;
    }
    
    async insertRecommendationsData(recommendationData) {
        const { from_user_id, to_user_id, movie_id, recommendation_type } = recommendationData;
        const query = `INSERT INTO Recommendations (from_user_id, to_user_id, movie_id, recommendation_type)
                       VALUES (?, ?, ?, ?);`;
        const [result] = await this.pool.execute(query, [from_user_id, to_user_id, movie_id, recommendation_type]);
        return result.affectedRows === 1;
    }
    
    async insertWatchlistData(watchlistData) {
        const { user_id, movie_id, status, rating } = watchlistData;
        const query = `INSERT INTO Watchlist (user_id, movie_id, status, rating)
                       VALUES (?, ?, ?, ?);`;
        const [result] = await this.pool.execute(query, [user_id, movie_id, status, rating]);
        return result.affectedRows === 1;
    }
    //temp
    async insertMoviesData(moviesData) {
        const { title, genres, release_date, runtime, overview, tagline, vote_average, vote_count, popularity, revenue, budget, production_companies, original_languages } = moviesData;
    
        // Insert into Movies table
        const movieQuery = `
            INSERT INTO Movies (title, release_date, vote_average, vote_count, popularity, overview, budget, revenue, runtime, tagline)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const [movieResult] = await this.pool.execute(movieQuery, [title, release_date, vote_average, vote_count, popularity, overview, budget, revenue, runtime, tagline]);
    
        if (movieResult.affectedRows !== 1) {
            return false;
        }
    
        // Capture the last inserted movie ID
        const lastMovieId = movieResult.insertId;
    
        // Insert the genre if it doesn't exist
        const insertGenreQuery = `
            INSERT IGNORE INTO Genres (name)
            VALUES (?);
        `;
        await this.pool.execute(insertGenreQuery, [genres]);
    
        // Get the genre ID
        const [genreIdRows] = await this.pool.execute("SELECT id FROM Genres WHERE name = ?", [genres]);
        const genreId = genreIdRows[0].id;
    
        // Insert into Movie_Genres
        const insertMovieGenreQuery = `
            INSERT IGNORE INTO Movie_Genres (movie_id, genre_id)
            VALUES (?, ?);
        `;
        await this.pool.execute(insertMovieGenreQuery, [lastMovieId, genreId]);
    
        // Insert the original language if it doesn't exist
        const insertOriginalLanguageQuery = `
            INSERT IGNORE INTO OriginalLanguages (name)
            VALUES (?);
        `;
        await this.pool.execute(insertOriginalLanguageQuery, [original_languages]);
    
        // Get the original language ID
        const [originalLanguageIdRows] = await this.pool.execute("SELECT id FROM OriginalLanguages WHERE name = ?", [original_languages]);
        const originalLanguageId = originalLanguageIdRows[0].id;
    
        // Insert into Movie_OriginalLanguages
        const insertMovieOriginalLanguageQuery = `
            INSERT IGNORE INTO Movie_OriginalLanguages (movie_id, original_language_id)
            VALUES (?, ?);
        `;
        await this.pool.execute(insertMovieOriginalLanguageQuery, [lastMovieId, originalLanguageId]);
    
        // Insert the production company if it doesn't exist
        const insertProductionCompanyQuery = `
            INSERT IGNORE INTO ProductionCompanies (name)
            VALUES (?);
        `;
        await this.pool.execute(insertProductionCompanyQuery, [production_companies]);
    
        // Get the production company ID
        const [productionCompanyIdRows] = await this.pool.execute("SELECT id FROM ProductionCompanies WHERE name = ?", [production_companies]);
        const productionCompanyId = productionCompanyIdRows[0].id;
    
        // Insert into Movie_ProductionCompanies
        const insertMovieProductionCompanyQuery = `
            INSERT IGNORE INTO Movie_ProductionCompanies (movie_id, production_company_id)
            VALUES (?, ?);
        `;
        await this.pool.execute(insertMovieProductionCompanyQuery, [lastMovieId, productionCompanyId]);
    
        return true;
    }
    
    
    
    async login(loginData) {
        const { username, password_hash } = loginData;
        const query = `SELECT * FROM Users WHERE username = ? AND password_hash = ?;`;
        const [result] = await this.pool.execute(query, [username, password_hash]);
        console.log(result);
        return result.length === 1 ? result[0] : null;
    }
    
    /* async updateDataById(table, id, updatedData) {
        const setClause = Object.entries(updatedData).map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`).join(',');
        const query = `UPDATE ${table} SET ${setClause} WHERE id = ${id};`;
        const [result] = await this.pool.execute(query);
        return result.affectedRows === 1;
    } */

    async updateUsersData(id, updatedUserData) {
        const { username, email, password_hash, first_name, last_name, birthdate, profile_picture, bio, country } = updatedUserData;
        const query = `UPDATE Users 
                       SET username = ?, email = ?, password_hash = ?, first_name = ?, last_name = ?, birthdate = ?, profile_picture = ?, bio = ?, country = ?
                       WHERE id = ?;`;
        const [result] = await this.pool.execute(query, [username, email, password_hash, first_name, last_name, birthdate, profile_picture, bio, country, id]);
        return result.affectedRows === 1;
    }
    
    async updateReviewsData(id, updatedReviewData) {
        const { rating, comment } = updatedReviewData;
        const query = `UPDATE Reviews 
                       SET rating = ?, comment = ?
                       WHERE id = ?`;
        const [result] = await this.pool.execute(query, [rating, comment, id]);
        return result.affectedRows === 1;
    }
        
    
    async updateRecommendationsData(id, updatedRecommendationData) {
        const { recommendation_type } = updatedRecommendationData;
        const query = `UPDATE Recommendations 
                       SET recommendation_type = ?
                       WHERE id = ?;`;
        const [result] = await this.pool.execute(query, [recommendation_type, id]);
        return result.affectedRows === 1;
    }
    
    async updateWatchlistData(id, updatedWatchlistData) {
        const { status, rating } = updatedWatchlistData;
        const query = `UPDATE Watchlist 
                       SET status = ?, rating = ?
                       WHERE id = ?;`;
        const [result] = await this.pool.execute(query, [status, rating, id]);
        return result.affectedRows === 1;
    }    
    //temp
   async updateMoviesData(id, updatedMoviesData) {
    const { title, release_date, runtime, overview, tagline, vote_average, vote_count, popularity, revenue, budget, production_companies, original_languages, genres } = updatedMoviesData;

    const updateMoviesQuery = `
        UPDATE Movies
        SET title = ?,
            release_date = ?,
            vote_average = ?,
            vote_count = ?,
            popularity = ?,
            overview = ?,
            budget = ?,
            revenue = ?,
            runtime = ?,
            tagline = ?
        WHERE id = ?;
    `;

    const insertGenresQuery = `
        INSERT IGNORE INTO Genres (name)
        VALUES (?);
    `;

    const getGenreIdQuery = `
        SELECT id FROM Genres WHERE name = ?;
    `;

    const deleteMovieGenresQuery = `
        DELETE FROM Movie_Genres WHERE movie_id = ?;
    `;

    const insertMovieGenresQuery = `
        INSERT IGNORE INTO Movie_Genres (movie_id, genre_id)
        VALUES (?, ?);
    `;

    const deleteMovieOriginalLanguagesQuery = `
        DELETE FROM Movie_OriginalLanguages WHERE movie_id = ?;
    `;

    const insertOriginalLanguagesQuery = `
        INSERT IGNORE INTO OriginalLanguages (name)
        VALUES (?);
    `;

    const getOriginalLanguageIdQuery = `
        SELECT id FROM OriginalLanguages WHERE name = ?;
    `;

    const insertMovieOriginalLanguagesQuery = `
        INSERT IGNORE INTO Movie_OriginalLanguages (movie_id, original_language_id)
        VALUES (?, ?);
    `;

    const deleteMovieProductionCompaniesQuery = `
        DELETE FROM Movie_ProductionCompanies WHERE movie_id = ?;
    `;

    const insertProductionCompaniesQuery = `
        INSERT IGNORE INTO ProductionCompanies (name)
        VALUES (?);
    `;

    const getProductionCompanyIdQuery = `
        SELECT id FROM ProductionCompanies WHERE name = ?;
    `;

    const insertMovieProductionCompaniesQuery = `
        INSERT IGNORE INTO Movie_ProductionCompanies (movie_id, production_company_id)
        VALUES (?, ?);
    `;

    try {
        await this.pool.execute(updateMoviesQuery, [
            title, release_date, vote_average, vote_count, popularity, overview, budget, revenue, runtime, tagline, id
        ]);

        await this.pool.execute(insertGenresQuery, [genres]);
        const [genreRows] = await this.pool.execute(getGenreIdQuery, [genres]);
        const genreId = genreRows[0].id;
        await this.pool.execute(deleteMovieGenresQuery, [id]);
        await this.pool.execute(insertMovieGenresQuery, [id, genreId]);

        await this.pool.execute(deleteMovieOriginalLanguagesQuery, [id]);
        await this.pool.execute(insertOriginalLanguagesQuery, [original_languages]);
        const [languageRows] = await this.pool.execute(getOriginalLanguageIdQuery, [original_languages]);
        const languageId = languageRows[0].id;
        await this.pool.execute(insertMovieOriginalLanguagesQuery, [id, languageId]);

        await this.pool.execute(deleteMovieProductionCompaniesQuery, [id]);
        await this.pool.execute(insertProductionCompaniesQuery, [production_companies]);
        const [companyRows] = await this.pool.execute(getProductionCompanyIdQuery, [production_companies]);
        const companyId = companyRows[0].id;
        await this.pool.execute(insertMovieProductionCompaniesQuery, [id, companyId]);

        return true;
    } catch (error) {
        console.error("Error updating movie data:", error);
        return false;
    }
}

    
    
    async deleteDataById(table, id) {
        const query = `DELETE FROM ${table} WHERE id = ?;`;
        const [result] = await this.pool.execute(query, [id]);
        return result.affectedRows === 1;
    }

    async searchById(table, id) {
        const query = `SELECT * FROM ${table} WHERE id = ?;`;
        const [rows] = await this.pool.execute(query, [id]);
        return rows;
    }

    async getAllMovies(){
        const query =`SELECT
        m.id,
        m.title,
        m.release_date,
        m.vote_average,
        m.vote_count,
        m.popularity,
        m.overview,
        m.budget,
        m.revenue,
        m.runtime,
        m.tagline,
        GROUP_CONCAT(DISTINCT g.name) AS genres,
        GROUP_CONCAT(DISTINCT ol.name) AS original_languages,
        GROUP_CONCAT(DISTINCT pc.name) AS production_companies
    FROM
        movies m
    LEFT JOIN
        movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN
        genres g ON mg.genre_id = g.id
    LEFT JOIN
        movie_originallanguages mol ON m.id = mol.movie_id
    LEFT JOIN
        originallanguages ol ON mol.original_language_id = ol.id
    LEFT JOIN
        movie_productioncompanies mpc ON m.id = mpc.movie_id
    LEFT JOIN
        productioncompanies pc ON mpc.production_company_id = pc.id
    GROUP BY
        m.id;`
        const [result] = await this.pool.execute(query);
        return result;
    }

    async getMovieData(id){
        const query =`SELECT
        m.id,
        m.title,
        m.release_date,
        m.vote_average,
        m.vote_count,
        m.popularity,
        m.overview,
        m.budget,
        m.revenue,
        m.runtime,
        m.tagline,
        GROUP_CONCAT(DISTINCT g.name) AS genres,
        GROUP_CONCAT(DISTINCT ol.name) AS original_languages,
        GROUP_CONCAT(DISTINCT pc.name) AS production_companies
    FROM
        movies m
    LEFT JOIN
        movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN
        genres g ON mg.genre_id = g.id
    LEFT JOIN
        movie_originallanguages mol ON m.id = mol.movie_id
    LEFT JOIN
        originallanguages ol ON mol.original_language_id = ol.id
    LEFT JOIN
        movie_productioncompanies mpc ON m.id = mpc.movie_id
    LEFT JOIN
        productioncompanies pc ON mpc.production_company_id = pc.id
    WHERE
        m.id in (?)
    GROUP BY
        m.id;`
        const [result] = await this.pool.execute(query, [id]);
        return result;
    }

    
}

// Create an instance of DbService
const dbService = new DbService();
// Now you can call the getAllData method on the dbService instance
/* (async () => {
    try {
        const data = await dbService.insertusersData('newuser','newuser@user', 'password',null,null,null,null,null,null);
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
})();   */

module.exports = DbService;
