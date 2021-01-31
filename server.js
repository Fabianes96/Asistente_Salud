var user = require("./model/users");
var firestoreService = require('./firestoreService')
const express = require("express");
const dialog = require("./Dialog");
const server = express();

//Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

//Variables
const db = firestoreService.db;
var collection = 'users'
var cedGlobal;

//Endpoints
server.get("/", (req, res) => {
  res.status(200);
  return res.json("Asistente de Salud");
});

server.post("/salud", async (req, res) => {
  let context;
  let result;
  let opciones = [""];
  try {
    context = req.body.queryResult.action;
    textoEnviar = `Recibida petición de acción: ${context}`;
    if (context === "input.welcome") {
      try {
        let nombre = req.body.queryResult.parameters.nombre;
        let apellido = req.body.queryResult.parameters.apellido;
        let fecha_nac = req.body.queryResult.parameters.nacimiento;
        let ced = req.body.queryResult.parameters.cedula;        
        textoEnviar = "Hola! Soy tu asistente de salud";
        if (!ced) {
          result = dialog.respuestaInicial(textoEnviar, "Ingrese su cédula");
        } else {
          try {
            cedGlobal = ced
            var docRef = db.collection(collection).doc(ced);
            await docRef.get().then((doc) => {
              if (doc.exists) {
                nombre = doc.data().name;
                apellido = doc.data().lastname;
                fecha_nac = doc.data().date;
                result = dialog.parameters(
                  `Hola ${nombre}. Si tienes problemas de salud responde: 'Me siento mal'`,
                  fecha_nac,
                  nombre,
                  apellido
                );
                opciones = ["Me siento mal", "Salir"]
              } else {                         
                result = dialog.webhookResponse(
                  "Registrando nuevo usuario. Por favor ingrese su nombre"
                );
                opciones = ["Salir"]
              }
            });            
          } catch (error) {
              console.log(error);
              result = dialog.webhookResponse(
                "Ocurrió un error inesperado. Por favor intente mas tarde"
              );
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else if (context === "DefaultWelcomeIntent.DefaultWelcomeIntent-custom") {
      let nombre = req.body.queryResult.parameters.nombre;
      let apellido = req.body.queryResult.parameters.apellido;
      let fecha_nac = req.body.queryResult.parameters.nacimiento;
      if (!nombre) {
        result = dialog.webhookResponse(
          "Registrando usuario nuevo, ingrese su nombre"
        );
        opciones = ["Salir"]
      } else if (!apellido) {
        result = dialog.webhookResponse("Ingrese su apellido");
        opciones = ["Salir"]
      } else if (!fecha_nac) {
        result = dialog.webhookResponse("Ingrese su fecha de nacimiento");
        opciones = ["Salir"]
      } else {        
        user.cc = cedGlobal
        user.name = nombre;
        user.lastname = apellido;
        user.date = fecha_nac;   
        user.sintomas = "";        
        firestoreService.addUser(user);
        result = dialog.webhookResponse("Usuario registrado");
        opciones = ["Me siento mal", "Salir"]
      }    
    }else if (context === "sintomas"){
      let sintomas = req.body.queryResult.parameters.sintomas;      
      if(!sintomas){
        result = dialog.webhookResponse("Indícame cuales son tus sintomas");
        opciones = ["Salir"]
      } else{
        user.sintomas = sintomas;
        firestoreService.updateUser({sintomas:sintomas},cedGlobal)      
        result = dialog.webhookResponse("Tenemos tus datos. Vamos a comunicarlo a un médico");
        opciones = ["Salir"]
      }
    }
  } catch (error) {
    console.log(error);
  }
  dialog.addOptions(result, opciones);
  res.json(result);
});
//Conexion
server.listen(process.env.PORT || port, () => {
  console.log("Server on port 3000");
});
