
const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const serverlessExpress = require('@vendia/serverless-express')
const bodyparser = require('body-parser')
const cors = require("cors")
require("dotenv").config();

const app = express()
app.use(cors())

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
// app.use(json())

app.get('/', (req, res) => {
    res.send('Hello World!');
  });


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // works
  }); 

  

app.post('/chatgpt', async (req, res) => {
    const prompt = req.body.input; // works

    const openai = new OpenAIApi(configuration);

    let messages = [
    {
        "role": "user", 
        "content": prompt
    }]

    console.log("req.body:") //
    console.log(req.body)

    res.send({"apikey": process.env.OPENAI_API_KEY})

    // Error 429 is RATE LIMIT ERROR

  try {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 100,
      });

    // console.log(response.data.choices[0].message.content)

    res.send(response.data.choices[0].message.content); // doesnt work
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// app.listen(port, () => {
//     console.log(`Server listening at http://localhost:${port}`);
//     });

exports.handler = serverlessExpress({ app })
