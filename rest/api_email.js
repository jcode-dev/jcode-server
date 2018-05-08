/*
 * rest endpoint の登録
 */

const express = require('express');
const router = express.Router();
const restapi =require('./restapi');

restapi.sendemail(router);

exports = module.exports = router;

