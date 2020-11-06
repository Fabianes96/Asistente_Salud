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
  let opciones = ["Prueba"];
  try {
    context = req.body.queryResult.action;
    textoEnviar = `Recibida petición de acción: ${context}`;
    if (context === "input.welcome") {
      textoEnviar = "Hola! Soy tu asistente de salud";
      result = dialog.respuestaInicial(
        textoEnviar,
        "¿Te puedo ayudar en algo?"
      );
      // }else if(context === "sintomas_gripa"){
      //     let fiebre ;
      //     let tos;
      //     let dolor_cabeza;
      //     try {
      //       tos = req.body.queryResult.parameters.tos
      //       fiebre = req.body.queryResult.parameters.fiebre;
      //       dolor_cabeza = req.body.queryResult.parameters.dolor_cabeza
      //     } catch (error) {
      //       console.log(error);
      //     }
      //     if(!tos){
      //       textoEnviar = "¿Tienes tos?"
      //       opciones = ["Si", "No"];
      //       result = dialog.webhookResponse(textoEnviar)
      //     }else if(!fiebre){
      //       textoEnviar = "¿Tienes fiebre?"
      //       opciones = ["Si", "No"];
      //       result = dialog.webhookResponse(textoEnviar)
      //     } else if(!dolor_cabeza){
      //       textoEnviar = "¿Tienes dolor de cabeza?"
      //       opciones = ["Si", "No"];
      //       result = dialog.webhookResponse(textoEnviar)
      //     } else{
      //       if(dolor_cabeza !== "No" && fiebre !== "No" && tos !== "No"){
      //         result = dialog.webhookResponse("Tienes gripa")
      //       } else{
      //         result = dialog.webhookResponse("Parece que no tienes gripa");
      //       }
      //     }
    } else if (context === "sintoma") {
      let ced;
      try {
        ced = req.body.queryResult.parameters.cedula;
        let nombre;
        let apellido;
        let fecha_nac;
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
  console.log(result, opciones);
  dialog.addOptions(result, opciones);
  res.json(result);
  
});

server.listen(process.env.PORT || port, () => {
  console.log("Server on port 3000");
});
