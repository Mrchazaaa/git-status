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
    //code to perform particular action.
    //To access POST variable use req.body()methods.
    // console.log(request);
    console.log(request.body);
    response.status(200).end() // Responding is important
});
