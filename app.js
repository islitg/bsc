//R E Q U I R E S
var express = require('express')
var bodyParser = require('body-parser')

var app = express();
var http = require('http');
var https = require('https');
var cons = require('consolidate')
var childProcess = require('child_process');
var path =require('path');
var phantomjs = require('phantomjs/lib/phantomjs');
var binPath = phantomjs.path
var fs = require('fs');
var session = require('express-session');
var debug = require('debug');
var log = debug('AATT:log');
var error = debug('AATT:error');
var nconf = require('nconf');

nconf.env().argv();

// B A S I C    C O N F I G
var http_port = nconf.get('http_port') || 80;           // Start with Sudo for starting in  port 80 or 443
var https_port = nconf.get('https_port') || 443;
var ssl_path= 'cert/ssl.key';
var cert_file = 'cert/abc.cer';


app.set('views', __dirname + '/views');
app.engine('html', cons.handlebars);
app.set('view engine', 'html');

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.use(session({ resave: true,
              saveUninitialized: true,
              secret: 'uwotm8' }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));
app.use('/test', express.static(__dirname + '/test'));
app.use('/canvas', express.static(__dirname + '/canvas'));
app.use(express.static('/canvas', {index: 'test.html'}));
app.use('/screen', express.static(__dirname + '/screen'));
app.use(express.static('/screen', {index: 'kirby.html'}));
//app.use('/screenshots', express.static(__dirname + '/screenshots'));
app.use('/Auditor',express.static(path.join(__dirname, 'src/HTML_CodeSniffer/Auditor')));
app.use('/Images',express.static(path.join(__dirname, 'src/HTML_CodeSniffer/Auditor/Images')));


//#var bodyParser = require('body-parser')
var server = http.createServer(app);
app.listen(http_port);
log('Express started on port ', http_port);

app.use(bodyParser.urlencoded({
  extended: true
  }));

var concat = require('concat-stream');
app.use(function(req, res, next){
  req.pipe(concat(function(data){
    req.body = data;
    next();
  }));
});

app.get('ajax_info.txt', function(req, res) {
  res.render('index.html',{data:''});
});


app.get('/ajax_info.txt', function(req, res) {
  res.render('ajax_info.html',{data:''});
});


app.get('/', function(req, res) {
  res.render('index.html',{data:''});
});

app.use(express.static('./public'));

const { parse } = require('querystring');

app.post('/saveScreen', function(req, res) {
    console.log(req.headers['content-type']);
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        console.log(
            parse(body)
        );
     });

          bufs = Buffer.from(req.body.toString().replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64').toString('binary');

          fs.writeFile(__dirname + '/images.png', bufs, "binary", function (err) {
              console.log('done');
          });
        res.send("OK!");
      });
