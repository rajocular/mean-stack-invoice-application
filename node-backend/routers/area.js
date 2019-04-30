const express = require('express');
const Area = require('../models/area');
const authCheck = require('../middleware/authCheck');

const router = express.Router();

const url = "/api/areas";


router.get(url, authCheck, (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const areaDocs = Area.find();
  let resultDocs;

  if(pageSize && currentPage) {
    areaDocs.skip(pageSize * (currentPage-1)).limit(pageSize);
  }

  areaDocs
    .then(documents=>{
      resultDocs = documents;
      return Area.countDocuments()
    })
    .then(count => {
    res.status(200).json({
      message: "Areas fetched successfully!",
      areas: resultDocs,
      count
    });
  });
});

router.get(url+"/:id", authCheck, (req, res, next) => {
  Area.findById(req.params.id).then(area =>{
    if(!area){
      return res.status(404).json({
        error: 'Not found!'
      });
    }
    res.status(200).json({
      area
    })
  }).catch(error =>{
    res.status(400).json({
      error: 'Object ID error!'
    })
  });
});


router.post(url, authCheck, (req, res, next) => {
  const area = new Area({
    code: req.body.code,
    name: req.body.name
  });
  area.save().then(newArea => {
    res.status(201).json({
      message: "Area added successfully!",
      area: newArea
    });
  }).catch(error => {
    res.status(400).json({
      message: "Code value already exists!",
      error
    })
  });
});

router.put(url+"/:id", authCheck, (req, res, next) =>{
  const area = new Area({
    _id: req.params.id,
    code: req.body.code,
    name: req.body.name
  });
  console.log(area);
  Area.updateOne({_id:req.params.id},area).then(result=>{
    res.status(201).json({
      message: 'Area updated successfully',
      area
    });
  }).catch((error)=>{
    res.status(400).json({
      message: "Unable to update",
      error
    })
  });
});

router.delete(url+"/:id", authCheck, (req, res, next) =>{
  Area.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({message: 'Deleted successfully!'});
  });
});

module.exports = router;

