'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  const welcome = agent => {
    agent.add(`Welcome to my agent!`);
  };
 
  const fallback = agent => {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  };
  
  const giveStilistName = agent => {
  	const serviceType = agent.parameters.type;
    const allServicesInOne = serviceType.map((service, index) =>
		(serviceType.length-1) == index ? `y ${service}` : `${service}`);
    const personName = agent.parameters.person.name;
    const date = agent.parameters.time.split('T')[0];
    const hour = agent.parameters.time.split('T')[1].substr(0,8); //Hace falta validar que coincida con la hora de apertura y cierre
    const phoneNumber = agent.parameters["phone-number"];
    const finalResponse = `Queda agendada la cita a nombre de ${personName} para el ${date} a las ${hour} 
		${allServicesInOne.length == 0 ? `para un ${allServicesInOne}` : `para los servicios de ${allServicesInOne}`}
		${phoneNumber ? `.Si hay algún inconveniente, te marcaremos al número: ${phoneNumber}` : ""}`;
    agent.add(finalResponse);
  };

  const intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('agendarCita', giveStilistName);
  agent.handleRequest(intentMap);
});

