const express = require('express');
const app = express();

app.set('view engine', 'ejs'); //views folder

// use res.render to load up an ejs view file

// index page
app.get('/', (req, res) => {
  let mascots = [
    { name: 'Sammy', organization: 'DigitalOcean', birth_year: 2012},
    { name: 'Tux', organization: "Linux", birth_year: 1996},
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
  ];
  let tagline = 'No programming concept is complete without a cute animal mascot.';

  res.render('pages/index', { //full path is views/pages/index
    mascots: mascots,
    tagline: tagline
  });
});

// about page
app.get('/about', (req, res) => {
res.render('pages/about');
});

app.listen(8080);
console.log('8080 is the magic port');
