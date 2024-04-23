const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const petRoutes = require('./routes/pets');
const animalTypesRouter = require('./routes/animalTypes');
const authRouter = require('./routes/authRoutes');
const userRoutes = require('./routes/userProfile');
const featuredPetsRoutes = require('./routes/featuredPets');
const emailSubscriptionRouter = require('./routes/emailSubscription');

const app = express();

// Apply CORS middleware
app.use(cors({
    origin: 'https://perfect-pet-match-frontend.onrender.com',  
    credentials: true  
}));

// Apply middleware for parsing json request bodies
app.use(express.json());
app.use(bodyParser.json());

// Apply routes
app.use('/pets',petRoutes);
app.use('/animalTypes',animalTypesRouter);
app.use('/authRoutes',authRouter);
app.use('/userProfile', userRoutes);
app.use('/featuredPets', featuredPetsRoutes);
app.use('/emailSubscription', emailSubscriptionRouter);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error.');
});

const PORT = process.env.PORT || 10000;  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
