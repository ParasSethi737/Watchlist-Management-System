const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbService = require('./database');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = new dbService();

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

app.get('/getAll/:table', async (req, res) => {
    const { table } = req.params;
    try {
        const data = await db.getAllData(table);
        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.get('/getAllMovies', async (req, res) => {
    const { table } = req.params;
    try {
        const data = await db.getAllMovies();
        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

/* app.post('/insert/:table', async (req, res) => {
    const { table } = req.params;
    const newData = req.body;
    try {
        const result = await db.insertData(table, newData);
        res.json({ success: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}); */

app.post('/insert/users', async (req, res) => {
    const userData = req.body;
    try {
        console.log(userData);
        const result = await db.insertUsersData(userData);
        res.json({ success: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.post('/insert/reviews', async (req, res) => {
    const reviewData = req.body;
    try {
        const result = await db.insertReviewsData(reviewData);
        res.json({ success: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.post('/insert/recommendations', async (req, res) => {
    const recommendationData = req.body;
    try {
        const result = await db.insertRecommendationsData(recommendationData);
        res.json({ success: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.post('/insert/watchlist', async (req, res) => {
    const watchlistData = req.body;
    try {
        const result = await db.insertWatchlistData(watchlistData);
        res.json({ success: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});
//temp
app.post('/insertMovies', async (req, res) => {
    const moviesData = req.body;
    try {
        const result = await db.insertMoviesData(moviesData);
        console.log(result);
        res.json({ success: result });
    } catch (error) {
        console.log(error);
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.post('/login', async (req, res) => {
    const loginData = req.body;
    console.log(loginData);
    try {
        const result = await db.login(loginData);
        res.json({ success: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

/* app.patch('/update/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const updatedData = req.body;
    try {
        const result = await db.updateDataById(table, id, updatedData);
        res.json({ success: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}); */

app.patch('/update/users/:id', async (req, res) => {
    const { id } = req.params;
    const updatedUserData = req.body;
    try {
        const result = await db.updateUsersData(id, updatedUserData);
        res.json({ success: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.patch('/update/reviews/:id', async (req, res) => {
    const { id } = req.params;
    const updatedReviewData = req.body;
    try {
        const result = await db.updateReviewsData(id, updatedReviewData);
        res.json({ success: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.patch('/update/recommendations/:id', async (req, res) => {
    const { id } = req.params;
    const updatedRecommendationData = req.body;
    try {
        const result = await db.updateRecommendationsData(id, updatedRecommendationData);
        res.json({ success: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.patch('/update/watchlist/:id', async (req, res) => {
    const { id } = req.params;
    const updatedWatchlistData = req.body;
    try {
        const result = await db.updateWatchlistData(id, updatedWatchlistData);
        res.json({ success: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});
//temp
app.patch('/updateMovies/:id', async (req, res) => {
    const { id } = req.params;
    const updatedMoviesData = req.body;
    try {
        const result = await db.updateMoviesData(id, updatedMoviesData);
        console.log(result);
        res.json({ success: result });
    } catch (error) {
        console.log(error);
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.delete('/delete/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    try {
        const result = await db.deleteDataById(table, id);
        res.json({ success: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.get('/search/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    try {
        const result = await db.searchById(table, id);
        res.json({ data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});


app.get('/searchMovies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.getMovieData(id);
        res.json({ data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));