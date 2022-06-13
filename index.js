let Client = require('ssh2-sftp-client');
let sftp = new Client();

//sftp server config
const creds = {
    host:"s-8eb19e5d5f41419fa.server.transfer.us-east-1.amazonaws.com",
    username:"michael_weiser",
    password:"1pp9#hL18K6DWhcZ",
    port:22
}

sftp.connect({...creds})                                                //connect to server
    .then(() => sftp.get('/sample_orders.csv', './sample_orders.csv'))  //download data
    .catch(err => console.log(err, 'catch error'))                      //catch errors
    .then(() => sftp.end())                                             //close connection

