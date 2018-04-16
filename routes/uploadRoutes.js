const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');

console.log(keys);

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKeyId: keys.secretAccessKeyId,
  signatureVersion: 'v4',
  region: 'us-west-2',
  endpoint: 's3-us-west-2.amazonaws.com'
});

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl('putObject', {
      Bucket: 'my-images-blogs',
      ContentType: 'image/jpeg',
      Key: key
    }, (err, url) => res.send({ key, url }));
  });
};
