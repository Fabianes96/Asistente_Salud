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
    try {
        context = req.body.queryResult.action;
        textoEnviar = `Recibida petición de acción: ${context}`;
        if(context=== "input.welcome"){            
            textoEnviar = "Webhook response......";
            result = dialog.webhookResponse(textoEnviar);
        }
    } catch (error) {
        console.log("Error contexto vacio: ", error);
    }
    res.status(200);
    res.json(result);
})

server.listen((process.env.PORT || 3000),()=>{
    console.log("Server on port 3000");
})
