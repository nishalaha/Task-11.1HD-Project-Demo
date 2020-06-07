// This #include statement was automatically added by the Particle IDE.
#include <HC_SR04.h>

// This #include statement was automatically added by the Particle IDE.
#include "MQTT.h"


// Create an MQTT client
MQTT client("test.mosquitto.org", 1883, callback);


// This is called when a message is received. However, we do not use this feature in
//wont use this
void callback(char* topic, byte* payload, unsigned int length) {
    
}

int cmGate = 0; //initializing
int cm1 = 0;
int cm2 = 0;
int trigPingate = D2; //defining pins
int echoPingate = D3;
int trigPin1 = D4;
int echoPin1 = D5;
int trigPin2 = D6;
int echoPin2 = D7;
HC_SR04 rangeFindergate = HC_SR04(trigPingate, echoPingate,0,300); //initizalizing distance funcions
HC_SR04 rangeFinder1 = HC_SR04(trigPin1, echoPin1,0,300);
HC_SR04 rangeFinder2 = HC_SR04(trigPin2, echoPin2,0,300);
// Setup the Photon
void setup() {
    // Connect to the server and call ourselves "photonDev"
    client.connect("photonDev34u7g67"); //unique client id
    pinMode(D7, OUTPUT);
}


// Main loop
void loop() {
    cmGate = rangeFindergate.getDistanceCM(); // running the function getdistance and putting it inside the variable
    cm1 = rangeFinder1.getDistanceCM();
    cm2 = rangeFinder2.getDistanceCM(); 
    
    
  
    // Only try to send messages if we are connected
    if (client.isConnected()) {
        // If the button is pressed it will be read as 0V since the button is
        // in an inverting configuation. 
        if (cmGate < 7){ //if the senser sense the distace less than 7 cm
            client.publish("photonLog", "gate"); //sending topic and message via mqtt to raspb pi
        }
        
        if (cm1 < 7){
            client.publish("photonLog", "spot1");
            Particle.publish("field1", "1", PRIVATE); //webhook intergration 
        }
        else{
            Particle.publish("SLOT1", "Free"); //triggering ifttt
        }
        if (cm2 < 7){
            client.publish("photonLog", "spot2");
            Particle.publish("field1", "1", PRIVATE); //webhook intergration 
        }
        else{
            Particle.publish("SLOT2","Free");
        }
       
        if (cm1 < 7 && cm2 < 7){
            client.publish("photonLog", "full");
        }
        
        else{
            client.publish("photonLog", "notfull");
        }
        
        delay(1000);
        
        // CALL THIS at the end of your loop
        client.loop();
    }
    
    delay(1000);
}