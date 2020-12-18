require('dotenv').config();

process.env.BASE_URL = 'http://127.0.0.1';
process.env.PORT = 12345;

require('./server');
require('./scheduled-jobs');