const express = require('express');
const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: false}));

const dialog = require('./Dialog');

server.get('/',(req,res)=>{
    res.status(200);
    return res.json("Asistente de Salud");
})

server.post('/salud',(req,res)=>{
    let context;
    let result;
    let opciones = ["Prueba"];
    try {
        context = req.body.queryResult.action;
        textoEnviar = `Recibida petición de acción: ${context}`;
        if(context=== "input.welcome"){            
            textoEnviar = "Hola! Soy tu asistente de salud";
            result = dialog.respuestaInicial(textoEnviar, "¿Te puedo ayudar en algo?");
        }else if(context === "sintomas_gripa"){
            let fiebre ;
            let tos;
            let dolor_cabeza;
            try {
              tos = req.body.queryResult.parameters.tos
              fiebre = req.body.queryResult.parameters.fiebre;
              dolor_cabeza = req.body.queryResult.parameters.dolor_cabeza
            } catch (error) {
              console.log(error);
            }
            if(!tos){
              textoEnviar = "¿Tienes tos?"
              opciones = ["Si", "No"];
              result = dialog.webhookResponse(textoEnviar)
            }else if(!fiebre){
              textoEnviar = "¿Tienes fiebre?"
              opciones = ["Si", "No"];
              result = dialog.webhookResponse(textoEnviar)
            } else if(!dolor_cabeza){
              textoEnviar = "¿Tienes dolor de cabeza?"
              opciones = ["Si", "No"];
              result = dialog.webhookResponse(textoEnviar)
            } else{
              if(dolor_cabeza !== "No" && fiebre !== "No" && tos !== "No"){
                result = dialog.webhookResponse("Tienes gripa")
              } else{
                result = dialog.webhookResponse("Parece que no tienes gripa");
              }              
            }
        
          }
    } catch (error) {
        console.log("Error contexto vacio: ", error);
    }    
    dialog.addOptions(result,opciones);
    res.json(result);
})

server.listen((process.env.PORT || 3000),()=>{
    console.log("Server on port 3000");
})
