const line = require("@line/bot-sdk");
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const { Translate } = require("@google-cloud/translate").v2;

// Import dependencies
const { TextServiceClient, DiscussServiceClient } =
  require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");

// const port = process.env.PORT || 3000;
const port = 4001;

const env = dotenv.config().parsed;
const config = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN,
};
// Get PaLM API key from Environment Variable
const API_KEY = env.API_KEY;

// Text service
const client = new line.Client(config);

app.post("/webhook", line.middleware(config), (req, res) => {
  try {
    const events = req.body.events;
    console.log(events);
    return events.length > 0
      ? Promise.all(events.map(handleEvent))
      : res.status(200).send("OK");
  } catch (error) {
    res.status(500).end();
  }
});

async function test(prompt) {
  // const client = new DiscussServiceClient({ authClient: new GoogleAuth().fromAPIKey(API_KEY) });
  const client_ai = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });
  return new Promise(async (resolve, reject) => {
    try {
      var res = await client_ai.generateText({
        model: "models/text-bison-001",
        prompt: { text: prompt },
      });
      resolve(res);
    } catch (error) {
      resolve([
        {
          candidates: [
            // {
            //   "safetyRatings": [
            //     {
            //       "category": "HARM_CATEGORY_DEROGATORY",
            //       "probability": "NEGLIGIBLE"
            //     },
            //     {
            //       "category": "HARM_CATEGORY_TOXICITY",
            //       "probability": "NEGLIGIBLE"
            //     },
            //     {
            //       "category": "HARM_CATEGORY_VIOLENCE",
            //       "probability": "NEGLIGIBLE"
            //     },
            //     {
            //       "category": "HARM_CATEGORY_SEXUAL",
            //       "probability": "NEGLIGIBLE"
            //     },
            //     {
            //       "category": "HARM_CATEGORY_MEDICAL",
            //       "probability": "NEGLIGIBLE"
            //     },
            //     {
            //       "category": "HARM_CATEGORY_DANGEROUS",
            //       "probability": "NEGLIGIBLE"
            //     }
            //   ],
            //   "output": "ไม่รองรับภาษาไทย"
            // }
          ],
          filters: [],
          safetyFeedback: [],
        },
        null,
        null,
      ]);
    }
  });
}
async function test_chat(prompt) {
  console.log(prompt);
  // const client = new DiscussServiceClient({ authClient: new GoogleAuth().fromAPIKey(API_KEY) });
  const client_ai = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });
  return new Promise(async (resolve, reject) => {
    try {
      console.log("try");
      var res = await client_ai.generateText({
        model: "models/text-bison-001",
        prompt: { text: prompt },
      });
      console.log(res);
      resolve(res);
    } catch (error) {
      console.log(error);
      resolve([
        {
          candidates: [
            // {
            //   "safetyRatings": [
            //     {
            //       "category": "HARM_CATEGORY_DEROGATORY",
            //       "probability": "NEGLIGIBLE"
            //     },
            //     {
            //       "category": "HARM_CATEGORY_TOXICITY",
            //       "probability": "NEGLIGIBLE"
            //     },
            //     {
            //       "category": "HARM_CATEGORY_VIOLENCE",
            //       "probability": "NEGLIGIBLE"
            //     },
            //     {
            //       "category": "HARM_CATEGORY_SEXUAL",
            //       "probability": "NEGLIGIBLE"
            //     },
            //     {
            //       "category": "HARM_CATEGORY_MEDICAL",
            //       "probability": "NEGLIGIBLE"
            //     },
            //     {
            //       "category": "HARM_CATEGORY_DANGEROUS",
            //       "probability": "NEGLIGIBLE"
            //     }
            //   ],
            //   "output": "ไม่รองรับภาษาไทย"
            // }
          ],
          filters: [],
          safetyFeedback: [],
        },
        null,
        null,
      ]);
    }
  });
}

async function detectLanguage() {
  const translate = new Translate({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });
  // const translate = new Translate();
  const text = "The text for which to detect language, e.g. Hello, world!";
  
  // Detects the language. "text" can be a string for detecting the language of
  // a single piece of text, or an array of strings for detecting the languages
  // of multiple texts.
  let [detections] = await translate.detect(text);
  detections = Array.isArray(detections) ? detections : [detections];
  console.log("Detections:");
  detections.forEach((detection) => {
    console.log(`${detection.input} => ${detection.language}`);
  });
}



const handleEvent = async (event) => {
  // repyr msg back
  console.log("Event incoming");
  detectLanguage();
  if (event.type === "message" && event.message.type === "text") {
    console.log(
      "🚀 ~ file: index.js:73 ~ handleEvent ~ event:",
      event.message.text
    );
    // var res = await google_map(event.message.text);
    let prompt = event.message.text;
    var res = await test_chat(prompt);

    console.assert(
      "🚀 ~ file: index.js:88 ~ handleEvent ~ res:",
      JSON.stringify(res)
    );
    console.assert(event.message.text, JSON.stringify(res));
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: `${res[0]?.candidates[0]?.output}`,
    });
  }
};

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
