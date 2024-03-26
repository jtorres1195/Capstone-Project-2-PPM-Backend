const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Pets = require('../models/Pets'); 
const { verifyToken } = require('../helpers/authHelper');
// Multer configuration for handling file uploads
// const upload = multer({ dest: 'uploads/' }); 
const router = express.Router();

// Get user profile
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User Profile', profile: user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user profile
router.put('/:id/update', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        if (userId !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, email } = req.body;

        if (username) {
            user.username = username;
        }
        if (email) {
            user.email = email;
        }

        await user.save();

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Change user password
router.put('/:id/change-password', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        if (userId !== req.params.id) {
            return res.status(403).json({ message: 'Forbidden: You can only change your own password' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { oldPassword, newPassword } = req.body;
        
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Old Password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing user password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// // Route for uploading profile pictures
// router.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
//     try {
//         const userId = req.user.userId; // Assuming you have middleware to extract user ID from JWT token
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         const profilePicturePath = req.file.path; // Path to the uploaded file
        
//         // Update user profile with profile picture path
//         await User.update({ profilePicture: profilePicturePath }, { where: { id: userId } });

//         res.json({ message: 'Profile picture uploaded successfully' });
//     } catch (error) {
//         console.error('Error uploading profile picture:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// Delete user profile
router.delete('/:id/delete', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        if (userId !== req.params.id) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own profile' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();

        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Save pet to user's profile
router.post('/:id/save-pet/:petId', verifyToken, async (req, res) => {
    try {
        const { userId, petId } = req.params;

        if (req.user.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized action.' });
        }

        const user = await User.findByPk(userId);
        const pet = await Pets.findByPk(petId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found.' });
        }

        await user.addPet(pet);

        res.json({ message: 'Pet saved to user profile' });
    } catch (error) {
        console.error('Error saving pet to user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Favorite/unfavorite pet
router.post('/:id/favorite-pet', verifyToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const petId = req.params.petId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPetFavorited = user.favoritePets.includes(petId);

        if (isPetFavorited) {
            user.favoritePets = user.favoritePets.filter(id => id !== petId);
        } else {
            user.favoritePets.push(petId);
        }

        await user.save();
        res.json({ message: 'Pet favorited toggled successfully' });
    } catch (error) {
        console.error('Error toggling pet favoriting:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
