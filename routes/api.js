var express = require('express');
var router  = express.Router();

router.get('/:ref', function(req, res, next) {
  _.merge(req.query, {ref: req.params.ref});
  try {
    var version = Generator.getByID(API.getAPIByRef(req.params.ref).generator).version;
    new Generators[version](req.query).generate(function(data, fmt) {
      res.setHeader('Content-Type', 'application/json');
      if (JSON.parse(data).error === true) {
        var data = JSON.parse(data);
        try {
          var trace = JSON.stringify(data.results[0]).match(/>:(\d+):(\d+)/).slice(1);
          res.send(`Error on line ${trace[0]-8} col ${trace[1]-0}: ${data.results[0].API_ERROR}`);
        } catch(e) {
          res.send(`Error ${data.results[0].API_ERROR}`);
        }
      } else {
        res.send(data);
      }
    });
  } catch (e) {
    console.log(e);
    res.setHeader('Content-Type', 'text/plain');
    res.status(403).send(e);
  }
});

module.exports = router;
