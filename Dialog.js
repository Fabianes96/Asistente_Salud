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
function respuestaInicial(texto1, texto2){
  let respuesta = {
      "fulfillmentText": texto1,
      "fulfillmentMessages": [
        {
          "platform": "ACTIONS_ON_GOOGLE",
          "simpleResponses": {
            "simpleResponses": [
              {
                "textToSpeech": texto1
              }
            ]
          }
        },
        {
          "platform": "ACTIONS_ON_GOOGLE",
          "simpleResponses": {
            "simpleResponses": [
              {
                "textToSpeech": texto2
              }
            ]
          }
        },
        {
          "platform": "ACTIONS_ON_GOOGLE",
          "simpleResponses": {
            "simpleResponses": [
              {
                "textToSpeech": texto1
              }
            ]
          }
        },
        {
          "text": {
            "text": [
              texto1
            ]
          }
        },
        {
          "text": {
            "text": [
              texto2
            ]
          }
        }
      ],   
  }
  return respuesta;

}
module.exports = {
  webhookResponse: webhookResponse,
  respuestaInicial: respuestaInicial
};