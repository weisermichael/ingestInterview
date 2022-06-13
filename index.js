const csv = require('csv-parser');
const fs = require('fs');

const Client = require('ssh2-sftp-client');
const sftp = new Client();

let results = {}

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
    let rest_ids = [];  //track restaurant ID's
    let order_ids = [];

    const writeFileFunc = (data) => fs.writeFile('parsed_data.json', data, {flag: 'a'}, err=>{});
    
    fs.createReadStream('sample_orders.csv')
        .pipe(csv())
        .on('data', (data) => {
            if (data.order_is_void == "False"){
                let order_id = Number(data.order_id)
                if(!(order_ids.includes(order_id))){
                    order_ids.push(order_id)
                    let subtotal = Number(data.order_subtotal.replace('$', '').replace(',', ''))
                    //console.log(subtotal)
                    let rest_id = Number(data.restaurant_id)
                    let checkId = rest_ids.includes(rest_id)    //true if id already included
                    if(!checkId){                               //if new restaurant ID, add to results
                        rest_ids.push(rest_id);
                        results[rest_id] = subtotal
                    }
                    else {
                        let newSum = results[rest_id] + subtotal
                        results[rest_id] = newSum
                    }
                    //writeFileFunc(JSON.stringify(data))
                } 
            }
        })
        .on('end', () => {
            console.log("finished")
            console.log(results)
        })
}