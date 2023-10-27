// Import dependencies
const { TextServiceClient, DiscussServiceClient } = require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");

// Get PaLM API key from Environment Variable
const API_KEY = "AIzaSyBGK6kM7Jrum1CKyDtl_rZhKRBio3fbU4U";

// Text service
const text = async (prompt) => {
  const client = new TextServiceClient({ authClient: new GoogleAuth().fromAPIKey(API_KEY) });
  return await client.generateText({
    model: "models/text-bison-001",
    prompt: { text: prompt }
  });
};

// Chat service
const chat = async (prompt) => {
  
};
async function test(prompt){
    // const client = new DiscussServiceClient({ authClient: new GoogleAuth().fromAPIKey(API_KEY) });
    const client = new TextServiceClient({ authClient: new GoogleAuth().fromAPIKey(API_KEY) });
  return await client.generateText({
    model: "models/text-bison-001",
    prompt: { text: prompt }
  });
}

async function main() {
  const result = await test("show me how to get started with LINE APIs");
  console.log(JSON.stringify(result));
}
main();
// module.exports = { text, chat };