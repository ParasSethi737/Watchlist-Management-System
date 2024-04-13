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
        const { user_id, movie_id, status, rating } = moviesData;
        const query = ``;
        const [result] = await this.pool.execute(query, [user_id, movie_id, status, rating]);
        return result.affectedRows === 1;
    }
    
    async login(loginData) {
        const { username, password_hash } = loginData;
        const query = `SELECT * FROM Users WHERE username = ? AND password_hash = ?;`;
        const [result] = await this.pool.execute(query, [username, password_hash]);
        return result;
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
        const { status, rating } = updatedMoviesData;
        const query = ``;
        const [result] = await this.pool.execute(query, [status, rating, id]);
        return result.affectedRows === 1;
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
