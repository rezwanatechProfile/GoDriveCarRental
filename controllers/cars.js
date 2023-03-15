const express = require('express');
const router = express.Router()
const Car = require('../models/cars.js')
const Customer = require('../models/customer.js')
const carSeed = require('../models/carseed.js');
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }  
})

const upload = multer({storage: storage})

//Routes

//Seed
router.get('/seed', (req, res) => {
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



//DELETE the order(Actually updating)
router.put('/delete/:id',(req,res)=>{
    Car.findByIdAndUpdate(req.params.id, req.body, { new: true}, 
      (err, updatedCar) => {
        //findBy
        if(err){
            console.log(err)
            res.send(err)
        }else{
            console.log(updatedCar)
            res.redirect('/cars/'+ req.params.id)            
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
			res.redirect('/cars/order/'+req.params.id)
		}

	})
})

//CREATE
router.post("/host", upload.single('img'), (req, res) => {

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

    Car.create(req.body, async(error, createdCar)=>{

        if (error){
        	console.log(error);
        	res.send(error);
        }
        else{
          if (req.file) {
            createdCar.img = req.file.filename
            console.log(createdCar.img)
            await createdCar.save()
          }
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

//DELETE host listing
router.delete('/host/:id',(req,res)=>{

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

//post reviews
// router.post('/review/:id', (req, res) => {
// 	Car.findByIdAndUpdate(req.params.id, req.body, { new: true}, 
// 	(err, selectedCar) => {

// 		if(err) {
// 			console.log(err)
// 			res.send(err)
// 		} else {
// 			console.log(selectedCar)
// 			// redirect to the index route 
// 			res.redirect('/cars/'+req.params.id)
// 		}

// 	})
// })


// //CREATE
// //Post Reviews
router.post('/review/:id', (req, res) => {

  Customer.create(req.body.id, req.body, (error, createdCar)=>{

      if (error){
        console.log(error);
        res.send(error);
      }
      else{
        res.redirect('/cars/'+req.params.id)
       
  }
        
      

      
  }); 
  
})



//SHOW
router.get('/:id', (req,res) => {
    Car.findById(req.params.id, (err, foundCar, foundCus) => {
        res.render("show.ejs", {
            car: foundCar
        })
    }) 

})

//Host Show
router.get('/host/:id', (req,res) => {
    Car.findById(req.params.id, (err, foundCar) => {
        res.render("hostShow.ejs", {
            car: foundCar
        })
    }) 
})

// router.get('/show/:id', (req,res) => {
//   Customer.findById(req.params.id, (err, foundCus) => {
//     res.render("hostShow.ejs", {
//         customer: foundCus
//     })
// })  

// })




module.exports = router