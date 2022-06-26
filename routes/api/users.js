const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/Users');
const gravatar = require("gravatar");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// @route GET api/users
// @desc Register user
// @access Public
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Enter valid Email ID')
        .isEmail(),
    check('password', 'Password must be 6 characters or more.')
        .isLength({ min: 6 })
], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
        // See if user exists
        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ errors: [ { msg: "User already exists"} ] });
        }
        // Get user gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm' // means default if nothing is there then any image there
        });

        user = new User({  // create the user
            name,
            email,
            avatar,
            password
        });

        // Encrypt the password 
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        // Encrypt the password
        await user.save(); // user getting saved in the database

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtsecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            }
        );
        // Return jsonwebtoken
    } catch(err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;