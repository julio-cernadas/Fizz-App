const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });
    user = await user.save();

    res.send(user);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('The customer with the given ID was not found.');

    res.send(user);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    }, { new: true });

    if (!user) return res.status(404).send('The customer with the given ID was not found.');

    res.send(user);
});

// router.delete('/:id', async (req, res) => {
//     const customer = await Customer.findByIdAndRemove(req.params.id);

//     if (!customer) return res.status(404).send('The customer with the given ID was not found.');

//     res.send(customer);
// });


module.exports = router;