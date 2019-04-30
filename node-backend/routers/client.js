const express = require('express');
const Client = require('../models/client');
const Area = require('../models/area');
const authCheck = require('../middleware/authCheck');

const router = express.Router();

const url = "/api/clients";

router.get(url, authCheck, (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const clientDocs = Client.find().populate('area');
  let resultDocs;

  if(pageSize && currentPage) {
    clientDocs.skip(pageSize*(currentPage-1)).limit(pageSize)
  }

  clientDocs
    .then(documents=>{
      resultDocs = documents;
      return Client.countDocuments()
    })
    .then(count=>{
      res.status(200).json({
        message: "clients fetched successfully",
        clients: resultDocs,
        count
      })
    })

  // Client.find().populate('area').exec((error, result)=>{
  //   if (error) {
  //     return res.status(404).json({
  //       error
  //     });
  //   }
  //   res.status(200).json({
  //     message: "clients fetched successfully",
  //     clients: result
  //   })
  // });
});

router.get(url+"/id/:id", authCheck, (req, res, next) =>{
  Client.findById(req.params.id).populate('area').exec((error, result)=>{
    if (error) {
      return res.status(404).json({
        error
      })
    }
    res.status(200).json({
      client: result
    })
  });
});

router.get(url+'/:type', authCheck, (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const clientDocs = Client.find({type: req.params.type}).populate('area');
  let resultDocs;

  if(pageSize && currentPage) {
    clientDocs.skip(pageSize*(currentPage-1)).limit(pageSize)
  }

  clientDocs
    .then(documents=>{
      resultDocs = documents;
      return Client.find({type: req.params.type}).countDocuments()
    })
    .then(count=>{
      res.status(200).json({
        message: "clients fetched successfully",
        clients: resultDocs,
        count
      })
    })

  // Client.find({type: req.params.type}).populate('area').exec((error, result)=>{
  //   if(error) {
  //     return res.status(404).json({
  //       error
  //     })
  //   }
  //   res.status(200).json({
  //     clients: result
  //   })
  // });
});

router.post(url, authCheck, (req, res, next) => {
  const client = new Client({
    area: req.body.area,
    name: req.body.name,
    address: req.body.address,
    contact: req.body.contact,
    pincode: req.body.pincode,
    gstnumber: req.body.gstnumber,
    type: req.body.type
  });
  Area.find({_id: client.area}).then( (result)=>{
    if(result.length>0)
    {
      client.save().then(newClient => {
        res.status(201).json({
          message: 'A client has been added successfully!',
          client: newClient
        })
      }).catch(() => {
        res.status(400).json({
          message: 'A client with that gst number already exists!'
        })
      });
    } else {
      res.status(400).json({
        message: 'Invalid area'
      })
    }
  })

});

router.put(url+"/:id", authCheck, (req, res, next) =>{
  const client = Client({
    _id: req.params.id,
    area: req.body.area,
    name: req.body.name,
    address: req.body.address,
    contact: req.body.contact,
    pincode: req.body.pincode,
    gstnumber: req.body.gstnumber,
    type: req.body.type
  });
  Client.updateOne({_id: req.params.id}, client).then(result =>{
    res.status(201).json({
      message: 'Client Update successful!',
      result
    });
  }).catch((error)=>{
    res.status(400).json({
      message: "Unable to update",
      error
    })
  });
});

router.delete(url+"/:id", authCheck, (req, res, next) =>{
  Client.deleteOne({_id: req.params.id}).then(result =>{
    res.status(200).json({
      message: 'The client record has been deleted!'
    });
  }).catch(error =>{
    res.status(400).json({
      message: 'There is no record with the given ID'
    });
  });
});

module.exports = router;
