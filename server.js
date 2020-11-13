var firebase = require("firebase/app");
require("firebase/firestore");
const express = require("express");
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

const dialog = require("./Dialog");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;
const firebase_config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};
firebase.initializeApp(firebase_config);
const db = firebase.firestore();

server.get("/", (req, res) => {
  res.status(200);
  return res.json("Asistente de Salud");
});

server.post("/salud",async (req, res) => {
  let context;
  let result;
  let opciones = [""];
  try {
    context = req.body.queryResult.action;
    textoEnviar = `Recibida petición de acción: ${context}`;
    if (context === "input.welcome") {
      try {        
      let nombre = req.body.queryResult.parameters.nombre;;
      let apellido = req.body.queryResult.parameters.apellido;;
      let fecha_nac = req.body.queryResult.parameters.nacimiento;
      let ced = req.body.queryResult.parameters.cedula
      textoEnviar = "Hola! Soy tu asistente de salud";      
      if(!ced){
        result = dialog.respuestaInicial(
          textoEnviar,
          "Ingrese su cedula"
        );    
      } else{
        var docRef = db.collection("users").doc(ced);        
        await docRef.get().then((doc)=>{
          if(doc.exists){
            nombre = doc.data().name;
            apellido = doc.data().lastname;
            fecha_nac = doc.data().date;            
            result = dialog.parameters(`Hola ${nombre}. En que te puedo ayudar?`,fecha_nac, nombre,apellido)
          } else{            
            // if(!nombre){
            //   result = dialog.webhookResponse("Registrando usuario nuevo, ingrese su nombre"); 
            // }else if(!apellido){
            //   result = dialog.webhookResponse("Ingrese su apellido");              
            // }else if(!fecha_nac){
            //   result = dialog.webhookResponse("Ingrese su fecha de nacimiento");              
            // }else{
            //   result = dialog.webhookResponse("Usuario registrado");
            // }
            result = dialog.webhookResponse("Registrando nuevo usuario");
          }
        })        
      }
      } catch (error) {
        console.log(error);
      }           
      
    } else if(context === "DefaultWelcomeIntent.DefaultWelcomeIntent-custom"){
      let nombre = req.body.queryResult.parameters.nombre;
      let apellido = req.body.queryResult.parameters.apellido;
      let fecha_nac = req.body.queryResult.parameters.nacimiento;
      if(!nombre){
              result = dialog.webhookResponse("Registrando usuario nuevo, ingrese su nombre"); 
            }else if(!apellido){
              result = dialog.webhookResponse("Ingrese su apellido");              
            }else if(!fecha_nac){
              result = dialog.webhookResponse("Ingrese su fecha de nacimiento");              
            }else{
              result = dialog.webhookResponse("Usuario registrado");
            }
    }else if (context === "sintoma") {
      let ced;
      try {
        ced = req.body.queryResult.parameters.cedula;        
        if (!ced) {
          textoEnviar = "Por favor dicte su cédula";
          opciones = [""];
          result = dialog.webhookResponse(textoEnviar);
        } else {
          var docRef = db.collection("users").doc(ced);
          await docRef.get().then((doc) => {
            if (doc.exists) {              
              textoEnviar = `Hola ${doc.data().name}. Vemos que sufres ${doc.data().enfermedad[0]}`
              result = dialog.webhookResponse(textoEnviar);
              console.log(result);
            } else {
              textoEnviar = 'Registraremos el nuevo usuario. Cúal es tu nombre?'
              opciones = [""];
              result = dialog.webhookResponse(textoEnviar);
            }
          });
        }
      } catch (error) {}
    }
  } catch (error) {
    console.log("Error de contexto vacio: ", error);
  }  
  dialog.addOptions(result, opciones);
  res.json(result);
  
});

server.listen(process.env.PORT || port, () => {
  console.log("Server on port 3000");
});
