const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const SavedPets = require('../models/SavedPets');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get user profile along with their saved pets
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findByPk(userId);
        const savedPets = await SavedPets.findSavedByUserId(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User Profile', profile: user, savedPets });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user profile
router.put('/:id/update', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    if (userId !== req.params.id) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
    }
    try {
        const user = await User.findByPk(userId);
        const { username, email } = req.body;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Change user password
router.put('/:id/change-password', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    if (userId !== req.params.id) {
        return res.status(403).json({ message: 'Forbidden: You can only change your own password' });
    }
    try {
        const user = await User.findByPk(userId);
        const { oldPassword, newPassword } = req.body;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid old password' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing user password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete user profile
router.delete('/:id/delete', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    if (userId !== req.params.id) {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own profile' });
    }
    try {
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

// Get saved pets for a user
router.get('/:id/saved-pets', verifyToken, async (req, res) => {
    const userId = req.params.id;

    if (req.user.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized: You can only view your own saved pets.' });
    }

    try {
        const savedPets = await SavedPets.findSavedByUserId(userId);
        if (!savedPets.length) {
            return res.status(404).json({ message: 'No saved pets found for this user.' });
        }
        res.json({ message: 'Saved pets retrieved successfully', savedPets });
    } catch (error) {
        console.error('Error retrieving saved pets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Save pet to user's profile
router.post('/:id/save-pet/:petId', verifyToken, async (req, res) => {
    const userId = req.params.id;
    const petId = req.params.petId;

    if (req.user.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized action.' });
    }

    try {
        const newSavedPet = await SavedPets.addSavedPet(userId, petId);
        if (newSavedPet) {
            res.status(201).json({ message: 'Pet saved to user profile', savedPet: newSavedPet });
        } else {
            res.status(404).json({ message: 'Pet not found.' });
        }
    } catch (error) {
        console.error('Error saving pet to user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
