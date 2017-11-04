const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const pngToJpeg = require('png-to-jpeg');

app.use(express.static('./dist'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.post('/parse', function (req, res) {
  const {image, name} = req.body;
  const buffer = new Buffer(image.split(/,\s*/)[1], 'base64');
  pngToJpeg({quality: 90})(buffer).then(output => fs.writeFileSync('./dist/images/' + name + '.jpg', output));

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    success: 'ok'
  }));
});

app.listen(3000, () => console.log('server is running...'));
