function webhookResponse(text){
    let res = {
        "fulfillmentText": text,
        "fulfillmentMessages": [
          {
            "platform": "ACTIONS_ON_GOOGLE",
            "simpleResponses": {
              "simpleResponses": [
                {
                  "textToSpeech": text
                }
              ]
            }
          },      
          {
            "text": {
              "text": [
                text
              ]
            }
          }
        ]
      };
      return res; 
}
module.exports = {webhookResponse};