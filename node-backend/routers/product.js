const express = require('express');
const Product = require('../models/product');
const authCheck = require('../middleware/authCheck');

const router = express.Router();

const url = "/api/products";

router.get(url, authCheck, (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const productDocs = Product.find();
  let resultDocs;

  if(pageSize && currentPage) {
    productDocs.skip(pageSize * (currentPage-1)).limit(pageSize);
  }

  productDocs
    .then(documents=>{
      resultDocs = documents;
      return Product.countDocuments()
    })
    .then(count => {
      res.status(200).json({
        message: "Products fetched successfully!",
        products: resultDocs,
        count
      });
    });
});

router.get(url+"/:id", authCheck, (req, res, next) =>{
  Product.findById(req.params.id).then(product =>{
    res.status(200).json({
      product
    })
  }).catch(()=>{
    res.status(404).json({
     error: 'No product exists with the given ID'
    });
  });
});

router.post(url, authCheck, (req, res, next) => {
  const product = Product({
    name: req.body.name,
    hsncode: req.body.hsncode,
    stock: req.body.stock,
    cost_price: req.body.cost_price,
    sale_price: req.body.sale_price,
    mrp: req.body.mrp,
    tax: req.body.tax
  });

  product.save().then(result =>{
    res.status(201).json({
      message: "A Product has been added successfully",
      product: result
    });
  }).catch((error) =>{
    res.status(400).json({
      error
    });
  });
});

router.put(url+"/:id", authCheck, (req, res, next) =>{
  const product =Product({
    _id: req.params.id,
    name: req.body.name,
    hsncode: req.body.hsncode,
    stock: req.body.stock,
    cost_price: req.body.cost_price,
    sale_price: req.body.sale_price,
    mrp: req.body.mrp,
    tax: req.body.tax
  });

  Product.updateOne({_id: req.params.id}, product).then(()=> {
    res.status(201).json({
      message: 'Product update successful'
    });
  }).catch((error)=>{
    res.status(400).json({
      message: "Couldn't update",
      error
    })
  });
});

router.delete(url+"/:id", authCheck, (req, res, next) =>{
  Product.deleteOne({_id:req.params.id}).then(()=>{
    res.status(200).json({
      message: 'Product has been deleted successfully'
    })
  }).catch(()=>{
    res.status(400).json({
      error: 'No such product exists'
    })
  });
});

module.exports = router;
