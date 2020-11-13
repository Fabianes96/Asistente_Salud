function webhookResponse(text) {
  let respuesta = {
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
  return respuesta; 
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
function parameters(text, nac, nom, ape){
  let respuesta = {
    "parameters":{
      "nacimiento": nac,
      "apellido": ape,
      "nombre": nom
    },
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
  return respuesta; 

}
function addOptions(res,opciones){  
  res.fulfillmentMessages.push( {
    "platform": "ACTIONS_ON_GOOGLE",
    "suggestions": {
      "suggestions": optionList(opciones)
    }
  }); 
}
function optionList(opciones){
  let res = [];
  for (let i = 0; i < opciones.length; i++) {
    res.push({"title": opciones[i]});
  }
  return res;
}
module.exports = {
  webhookResponse: webhookResponse,
  respuestaInicial: respuestaInicial,
  addOptions: addOptions,
  parameters: parameters
};