const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const request = require("request");
const config = require('config');
const { check, validationResult } = require('express-validator')


// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = (await Profile.findOne({ user: req.user.id })).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: "there is no profile for this user" })
        }
        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error")
    }
})


// @route   POST api/profile
// @desc    Create or Update Profile
// @access  Private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
        image
    } = req.body;


    // Build profile objects
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (image) profileFields.image = image;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername)
        profileFields.githubusername = githubusername;

    if (skills) {
        profileFields.skills = skills.split(',').map(skills => skills.trim());
    }

    // Social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            // update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile)
        }

        // create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }

})

// @route   GET api/profile
// @desc   GET Profile
// @access  PUBLIC


router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

// @route   GET api/profile/user/:user_id
// @desc   GET Profile by user id
// @access  PUBLIC


router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) return res.status(400).json({ msg: "there is no profile" })
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") return res.status(400).json({ msg: "profile not found" });
        res.status(500).send("Server Error")
    }
})

// @route   Delete api/profile
// @desc   Delete profile, user, posts
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {

        //remove user posts
        await Post.deleteMany({ user: req.user.id });
        // remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: "user removed" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});


// @route   PUT api/profile/experience
// @desc    ADD Profile Experience
// @access  Private

router.put('/experience', [auth, [
    check("title", "title is required").not().isEmpty(),
    check("company", "company is required").not().isEmpty(),
    check("from", "from date is required").not().isEmpty()
]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return any errors with 400 status
            return res.status(400).json({ errors: errors.array() });
        };

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            // Add to exp array
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error")
        }
    })

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        // Get remove index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// @route   PUT api/profile/education
// @desc    ADD Profile education
// @access  Private

router.put('/education', [auth, [
    check("school", "school is required").not().isEmpty(),
    check("degree", "degree is required").not().isEmpty(),
    check("fieldofstudy", "FIELD OF STUDY is required").not().isEmpty(),
    check("from", "from date is required").not().isEmpty()
]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return any errors with 400 status
            return res.status(400).json({ errors: errors.array() });
        };

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            // Add to exp array
            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error")
        }
    })

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        // Get remove index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
        // Splice out of array
        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// @route   GET api/profile/github/:username
// @desc   GET user repose from github
// @access  PUBLIC

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get("githubSecret")}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }
        request(options, (error, response, body) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: "no github profile found" });
            }
            res.json(JSON.parse(body))
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

module.exports = router;