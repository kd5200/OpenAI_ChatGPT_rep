// The purpose of this file is to configure our server to make calls to open AI 



import express from 'express';  
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({   //creating a variable for my OpenAI API key  
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express(); // initializing express
app.use(cors());  // making sure our app is using cors (cross-origin resourse sharing )
app.use(express.json());

app.get("/", async (req,res) => {
    res.status(200).send({
        message: 'Hello from CodeX',
    })
});

app.post('/', async (req,res) => {
    try {
        const prompt = req.body.prompt

        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:`${prompt}`,
            temperature:0,
            max_tokens:3000,
            top_p:1,
            frequency_penalty:0.5,
            presence_penalty:0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text // this is where our bot would give a response to the prompt our user gives
        })
    }   catch (error) {
            console.log(error);                     //Simply this will send an error message if the response logic 
            res.status(500).send({ error })

    }
})


const PORT = 3000
app.listen(3000, () => console.log(`Server is live on port http://localhost:${PORT}`)); 

// initialization of a Localhost port ^^^