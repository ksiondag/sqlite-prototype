'use strict';

const express = require('express');
const app = require('./route')(express);

if (module === require.main) {
    app.listen(port);
    console.log('Running prototype on port ' + port);
}

