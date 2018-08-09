const soap = require('strong-soap').soap;
// const soap = require('soap');
const fs = require('fs');

/**
 * npm soap package cannot be used with services having methods which has arguments having target namespaces.
 * npm soap will ignore these namespaces in arguments.
 */

let url = 'http://localhost:8080/thusitha/onlineBanking?wsdl';

let fileBytes = new Buffer(fs.readFileSync('./to-upload/abc.txt')).toString('base64');
// let fileBytes = getByteArray('./to-upload/abc.txt');

let args = {
    fileName: 'abc.txt',
    fileBytes: fileBytes
};
// soap.createClient(url, {preserveWhitespace: true, disableCache: true}, function(err, client) {
//
//     client.upload(args, function(err, result) {
//         if (err) {
//             return console.log('Error', err.body);
//         }
//         console.log(result);
//     });
// });

soap.createClient(url, {}, function(err, client) {
    let method = client['OnlineBankingService']['OnlineBankingPort']['upload'];
    method(args, function(err, result, envelope, soapHeader) {
        //response envelope
        console.log('Response Envelope: \n' + envelope);
        //'result' is the response body
        console.log('Result: \n' + JSON.stringify(result));
    });
});