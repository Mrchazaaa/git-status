const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const port = 3000

app.use(express.static('../client/build'));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.post('/handle',(request,response) => {
    var data = request.body;
    console.log(data.pusher);
    response.status(200).end() // Responding is important
});
