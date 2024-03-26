const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const petRoutes = require('./routes/pets');
const animalTypesRoutes = require('./routes/animalTypes');
const searchRoutes = require('./routes/searchPets');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const signupRouter = require('./routes/signup');
const userRoutes = require('./routes/userProfile');
const favPetsRoutes = require('./routes/favoritePets');
const featuredPetsRoutes = require('./routes/featuredPets');
const savePetsRoutes = require('./routes/savedPets');
const emailSubscriptionRouter = require('./routes/emailSubscription');

const app = express();

// Apply CORS middlware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Apply middleware for parsing json request bodies
app.use(express.json());
app.use(bodyParser.json());

// Apply routes
app.use('/pets',petRoutes);
app.use('/animalTypes',animalTypesRoutes);
app.use('/searchPets',searchRoutes);
app.use('/login',loginRouter);
app.use('/logout',logoutRouter);
app.use('/signup', signupRouter);
app.use('/userProfile', userRoutes);
app.use('/favoritePets', favPetsRoutes);
app.use('/savedPets', savePetsRoutes);
app.use('/featuredPets', featuredPetsRoutes);
app.use('/emailSubscription', emailSubscriptionRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong.');
});

const PORT = process.env.PORT || 3001;  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
