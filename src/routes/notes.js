const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req,res) => {
    res.render('notes/new-note');
})
router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title, description, quantity, price, actual_price, expire_date } = req.body;
    const errors = [];
    if(!title){
        errors.push({text: 'please enter a title'})
    }
    if(!description){
        errors.push({text: 'please enter a description'})
    }
    if(!quantity){
        errors.push({text: 'please enter amount'})
    }
    if(!actual_price){
        errors.push({text: 'please enter a price'})
    }
    if(errors.length > 0){
        res.render('notes/new-note', {
            errors,
            title,
            description
        })
    } else{
        const newNote = new Note({title, description, quantity, price, actual_price, expire_date});
        newNote.user = req.user.id; //enlazar cada nota al id del user
        await newNote.save(); //save on mongodb
        req.flash('success_msg', 'Note Added Correctly');
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async (req,res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});//check database
    res.render('notes/all-notes', {notes});
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note});
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description, quantity, price, actual_price, expire_date} =  req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description, quantity, price, actual_price, expire_date});
    req.flash('success_msg', 'Note Updated Correctly!');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Correctly!');
    res.redirect('/notes');
});

//plus 1 to hours
router.get('/notes/add-hrs/:id', function(req, res){
    Note.findById(req.params.id, function (err, note) {
        if (err) return handleError(err);

        note.quantity += 1;

        note.save(function(err) {
          if (err) return handleError(err);
          res.redirect('/notes'); // Or redirect, basically finish request.
        });
      });
});

//minus 1 to hours
router.get('/notes/rem-hrs/:id', function(req, res){
    Note.findById(req.params.id, function (err, note) {
        if (err) return handleError(err);
        if (note.quantity > 0) {
            note.quantity -= 1;
        }
        //if 0, delete
        /* if (note.hours == 0){
            Note.findOne({_id: note.id}, (err, doc) => {
                note.remove((err) => {
                    if (err) return handleError(err); // handle err
                });
                // or simply use
                note.remove();
            });
        } */
        note.save(function(err) {
        if (err) return handleError(err);
        res.redirect('/notes'); // Or redirect, basically finish request.
        });

    });
});

module.exports = router;