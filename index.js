const line = require("@line/bot-sdk");
const dotenv = require("dotenv");
const express = require("express");
const app = express();

// Import dependencies
const { TextServiceClient, DiscussServiceClient } =
  require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");

// const port = process.env.PORT || 3000;
const port = 4000;

const env = dotenv.config().parsed;
const config = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN,
};
// Get PaLM API key from Environment Variable
const API_KEY = "AIzaSyBGK6kM7Jrum1CKyDtl_rZhKRBio3fbU4U";

// Text service
const client = new line.Client(config);

app.post("/webhook", line.middleware(config), (req, res) => {
  try {
    const events = req.body.events;
    console.log(events)
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
              "candidates": [
                {
                  "safetyRatings": [
                    {
                      "category": "HARM_CATEGORY_DEROGATORY",
                      "probability": "NEGLIGIBLE"
                    },
                    {
                      "category": "HARM_CATEGORY_TOXICITY",
                      "probability": "NEGLIGIBLE"
                    },
                    {
                      "category": "HARM_CATEGORY_VIOLENCE",
                      "probability": "NEGLIGIBLE"
                    },
                    {
                      "category": "HARM_CATEGORY_SEXUAL",
                      "probability": "NEGLIGIBLE"
                    },
                    {
                      "category": "HARM_CATEGORY_MEDICAL",
                      "probability": "NEGLIGIBLE"
                    },
                    {
                      "category": "HARM_CATEGORY_DANGEROUS",
                      "probability": "NEGLIGIBLE"
                    }
                  ],
                  "output": "ไม่รองรับภาษาไทย"
                }
              ],
              "filters": [],
              "safetyFeedback": []
            },
            null,
            null
          ]);
    }
  });
  
 
}
async function test_chat(prompt) {
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
              "candidates": [
                {
                  "safetyRatings": [
                    {
                      "category": "HARM_CATEGORY_DEROGATORY",
                      "probability": "NEGLIGIBLE"
                    },
                    {
                      "category": "HARM_CATEGORY_TOXICITY",
                      "probability": "NEGLIGIBLE"
                    },
                    {
                      "category": "HARM_CATEGORY_VIOLENCE",
                      "probability": "NEGLIGIBLE"
                    },
                    {
                      "category": "HARM_CATEGORY_SEXUAL",
                      "probability": "NEGLIGIBLE"
                    },
                    {
                      "category": "HARM_CATEGORY_MEDICAL",
                      "probability": "NEGLIGIBLE"
                    },
                    {
                      "category": "HARM_CATEGORY_DANGEROUS",
                      "probability": "NEGLIGIBLE"
                    }
                  ],
                  "output": "ไม่รองรับภาษาไทย"
                }
              ],
              "filters": [],
              "safetyFeedback": []
            },
            null,
            null
          ]);
    }
  });
  
 
}

const handleEvent = async (event) => {
  // repyr msg back
  console.log("Event incoming")
  if (event.type === "message" && event.message.type === "text") {
    // var res = await google_map(event.message.text);
    let prompt = event.message.text;
    var res = await test_chat(prompt);
    console.log("🚀 ~ file: index.js:88 ~ handleEvent ~ res:", JSON.stringify(res));
    console.log(event.message.text, JSON.stringify(res));
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: `${res[0]?.candidates[0]?.output}`,
    });
  }
};

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
