const csv = require('csv-parser');
const fs = require('fs');

const Client = require('ssh2-sftp-client');
const sftp = new Client();

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
    .then(() => {
        sftp.end()                                                      //close connection
        toCSV()
    }
)                                             

const toCSV = () => {
    const writeFileFunc = (data) => fs.writeFile('parsed_data.json', data, {flag: 'a'}, err=>{});
    
    fs.createReadStream('sample_orders.csv')
        .pipe(csv())
        .on('data', (data) => {
            if (data[order_is_void] == "False"){
                writeFileFunc(JSON.stringify(data))
            }
        })
        .on('end', () => console.log("finished"))
}