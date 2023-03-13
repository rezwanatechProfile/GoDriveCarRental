const express = require('express');
const router = express.Router()
const Car = require('../models/cars.js')
const carSeed = require('../models/carSeed.js');

//Routes

//Seed
router.get('/seed', (req, res) => {
    Car.deleteMany({}, (error, allCars) => {});
	Car.create(carSeed, (error, data) => {
		res.redirect('/cars');
	});
});


//INDEX
router.get("/", (req,res)=>{
    Car.find({}, (error, allCars)=> {
        res.render("index.ejs", {
            cars: allCars
        })
    })
});




//HOST INDEX
router.get("/host", (req,res)=>{
    Car.find({}, (error, allCars)=> {
        res.render("hostIndex.ejs", {
            cars: allCars
        })
    })
});




//NEW
router.get("/new", (req, res) => {
    res.render("new.ejs")
})


//order page(to delete, edit and confirm)
router.get('/order/:id', (req,res) => {
    Car.findById(req.params.id, (err, bookedCar) => {
        res.render("order.ejs", {
            car: bookedCar
        })
    })
    
})

//confirm (final page to show purchase is done)
router.get('/confirm/:id', (req,res) => {
    Car.findById(req.params.id, (err, bookedCar) => {
        res.render("final.ejs", {
            car: bookedCar
        })
    })
    
})

router.get('/final/:id', (req,res) => {
    Car.findById(req.params.id, (err, bookedCar) => {
        res.render("final.ejs", {
            car: bookedCar
        })
    })
    
})



//DELETE the order
router.delete('/cart/:id',(req,res)=>{
    Car.findByIdAndDelete(req.params.id,(error, deletedCar)=>{
        //findBy
        if(error){
            console.log(error)
            res.send(error)
        }else{
            console.log(deletedCar)
            res.redirect('/cars')            
        }
    })
})


//UPDATE in order page from show page (after clicking reserve button)
router.put('/cart/:id', (req, res) => {
	Car.findByIdAndUpdate(req.params.id, req.body, { new: true}, 
	(err, selectedCar) => {

		if(err) {
			console.log(err)
			res.send(err)
		} else {
			console.log(selectedCar)
			// redirect to the index route 
			res.redirect('/cars/order/'+req.params.id)
		}

	})
})

//UPDATE of order page from editOrder page. Then return back to order page
router.put('/editorder/:id', (req, res) => {

	Car.findByIdAndUpdate(req.params.id, req.body, {new: true}, 
	(err, selectedCar) => {

		if(err) {
			console.log(err)
			res.send(err)
		} else {
			console.log(selectedCar)
			// redirect to the index route 
			res.redirect('/cars/final/'+req.params.id)
		}

	})
})

//CREATE
router.post("/host", (req, res) => {

    if(req.body.isAvailable === "on"){
        req.body.isAvailable = true
    } else {
        req.body.isAvailable = false
    }

    if(req.body.tag === "on"){
        req.body.tag = true
    } else {
        req.body.tag = false
    }

    Car.create(req.body, (error, createdCar)=>{
        if (error){
        	console.log(error);
        	res.send(error);
        }
        else{
	        res.redirect("/cars/host")
        }
    }); 
})


//EDIT the order after renter show page
router.get('/editorder/:id', (req, res) => {
	Car.findById(req.params.id, (err, foundCar) => {
		if(err) {
			console.log(err)
			res.send(err)
		} else {
			// make the edit form show the existing data 
			res.render('editOrder.ejs', {
				car: foundCar
			})
		}
	})
})

//DELETE
router.delete('/:id',(req,res)=>{
    Car.findByIdAndDelete(req.params.id,(error, deletedCar)=>{
        //findBy
        if(error){
            console.log(error)
            res.send(error)
        }else{
            console.log(deletedCar)
            res.redirect('/cars')
        }
    })
})


//UPDATE in hostshow page
router.put('/:id', (req, res) => {

	if (req.body.isAvailable === "on") {
		req.body.isAvailable = true
	} else {
		req.body.isAvailable = false
	}

	Car.findByIdAndUpdate(req.params.id, req.body, { new: true,}, 
	(err, updatedCar) => {
		if(err) {
			console.log(err)
			res.send(err)
		} else {
			console.log(updatedCar)
			// redirect to the index route 
			res.redirect('/cars/host/'+req.params.id)
		}

	})
})


//SHOW
router.get('/:id', (req,res) => {
    Car.findById(req.params.id, (err, foundCar) => {
        res.render("show.ejs", {
            car: foundCar
        })
    })   
})

router.get('/host/:id', (req,res) => {
    Car.findById(req.params.id, (err, foundCar) => {
        res.render("hostShow.ejs", {
            car: foundCar
        })
    })   
})


module.exports = router