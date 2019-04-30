const express = require('express');
const Invoice = require('../models/invoice');
const authCheck = require('../middleware/authCheck');

const router = express.Router();

const url = "/api/invoices";

router.get(url, authCheck, (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const invoiceDocs = Invoice.find().populate('client').populate('bills.product')
  let resultDocs;

  if(pageSize && currentPage) {
    invoiceDocs.skip(pageSize*(currentPage-1)).limit(pageSize)
  }

  invoiceDocs
    .then(documents=>{
      resultDocs = documents;
      return Invoice.countDocuments()
    })
    .then(count=>{
      res.status(200).json({
        message: "Invoices fetched successfully",
        invoices: resultDocs,
        count
      })
    });

  // Invoice.find().populate('client').populate('bills.product').exec((error, result)=>{
  //   res.status(200).json({
  //     message: "Invoices fetched successfully!",
  //     invoices: result
  //   });
  // });
});

router.get(url+"/:id", authCheck, (req, res, next) =>{
  Invoice.findById({_id:req.params.id}).populate('client').populate('bills.product').exec((error, result)=>{
    res.status(200).json({
      invoice: result
    });
  });
});

router.post(url, authCheck, (req, res, next) =>{
  const invoice = Invoice({
    date: req.body.date,
    client: req.body.client,
    bills: req.body.bills,
    amount: req.body.amount,
    tax_amount: req.body.tax_amount,
    total: req.body.total
  });

  invoice.save().then(result=>{
    res.status(201).json({
      message: 'Invoice added successfully',
      result
    });
  }).catch( error=>{
    res.status(400).json({
      message: 'unable to add invoice',
      error
    });
  });
});

router.put(url+"/:id",authCheck,  (req, res, next) =>{
  const invoice = Invoice({
    _id: req.params.id,
    date: req.body.date,
    client: req.body.client,
    bills: req.body.bills,
    amount: req.body.amount,
    tax_amount: req.body.tax_amount,
    total: req.body.total
  });

  Invoice.updateOne({_id: req.params.id}, invoice).then((invoice) =>{
    res.status(200).json({
      message: 'Invoice updated successfully',
      invoice
    });
  }).catch(error=>{
    res.status(400).json({
      error
    });
  });
});

router.delete(url+"/:id",authCheck,  (req, res, next)=>{
  Invoice.deleteOne({_id: req.params.id}).then(()=>{
    res.status(200).json({
      message: 'Invoice record deleted successfully'
    });
  }).catch(()=>{
    res.status(404).json({
      error: 'No invoice with the given ID'
    });
  });
});

module.exports = router;
