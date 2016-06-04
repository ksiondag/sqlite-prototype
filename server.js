'use strict';

const express = require('express');
const app = require('./route')(express);
const port = process.env.PORT || 8080;

if (module === require.main) {
    app.listen(port);
    console.log('Running prototype on port ' + port);
}

