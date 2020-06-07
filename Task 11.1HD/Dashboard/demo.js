// Called after form input is processed
function startConnect() {
    // Generate a random client ID
    clientID = "clientID-kbrvew535" + parseInt(Math.random() * 100);

    // Fetch the hostname/IP address and port number from the form
    host = "test.mosquitto.org";
    port = "8080";

    // Print output for the user in the messages div
    document.getElementById("messages").innerHTML += '<span>Connecting to: ' + host + ' on port: ' + port + '</span><br/>';
    document.getElementById("messages").innerHTML += '<span>Using the following client value: ' + clientID + '</span><br/>';

    // Initialize new Paho client connection
    client = new Paho.MQTT.Client(host, Number(port), clientID);

    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({ 
        onSuccess: onConnect,
    });
    disableArr()
}

// Called when the client connects
function onConnect() {
    // Fetch the MQTT topic from the form
    topic = "photonLog";

    // Print output for the user in the messages div
    document.getElementById("messages").innerHTML += '<span>Subscribing to: ' + topic + '</span><br/>';

    // Subscribe to the requested topic
    client.subscribe(topic);
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    document.getElementById("messages").innerHTML += '<span>ERROR: Connection lost</span><br/>';
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML += '<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>';
    }
}

// Called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived: " + message.payloadString);
    document.getElementById("messages").innerHTML += '<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>';
    if (message.payloadString == "spot1"){
        disableRe1()
    }
    if (message.payloadString == "nospot1"){
        EnableRe1()
    }
    if (message.payloadString == "spot2"){
        disableRe2()
    }
    if (message.payloadString == "nospot2"){
        EnableRe2()
    }
    if (message.payloadString == "gate"){
        gate()
    }
}

// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}
function EnableRe1(){
    var btn = document.getElementById("reserve1")
    btn.disabled = false;
}
function disableRe1(){
    var btn = document.getElementById("reserve1")
    btn.disabled = true;
    
    document.getElementById("heading1").textContent = "STATUS: AVAILABLE";
}
function EnableRe2(){
    var btn = document.getElementById("reserve2")
    btn.disabled = false;
    
    document.getElementById("heading2").textContent = "STATUS: AVAILABLE";
}
function disableRe2(){
    var btn = document.getElementById("reserve2")
    btn.disabled = true;
}
function EnableArr(){
    var btn = document.getElementById("arrive")
    btn.disabled = false;
    
}
function disableArr(){
    var btn = document.getElementById("arrive")
    btn.disabled = true;
}
function Arrive1(){ //sending msg through mqtt
    message = new Paho.MQTT.Message("arrive1")
    message.destinationName = "photonLog"
    client.send(message)
    document.getElementById("heading1").textContent = "STATUS: OCCUPIED";
    disableRe1()
}
function Arrive2(){
    message = new Paho.MQTT.Message("arrive2")
    message.destinationName = "photonLog"
    client.send(message)
    document.getElementById("heading2").textContent = "STATUS: OCCUPIED";
}
function Reserve1(){
    message = new Paho.MQTT.Message("reserve1")
    message.destinationName = "photonLog"
    client.send(message)
    EnableArr()
    document.getElementById("heading1").textContent = "STATUS: RESERVED";
    
}
function Cancel1(){
    message = new Paho.MQTT.Message("reserve1off")
    message.destinationName = "photonLog"
    client.send(message)
    disableArr()
    document.getElementById("heading1").textContent = "STATUS: AVAILABLE";
}
function Reserve2(){
    message = new Paho.MQTT.Message("reserve2")
    message.destinationName = "photonLog"
    client.send(message)
    EnableArr()
    document.getElementById("heading2").textContent = "STATUS: RESERVED";
    
}
function Cancel2(){
    message = new Paho.MQTT.Message("reserve2off")
    message.destinationName = "photonLog"
    client.send(message)
    disableArr()
    document.getElementById("heading2").textContent = "STATUS: AVAILABLE";
}

