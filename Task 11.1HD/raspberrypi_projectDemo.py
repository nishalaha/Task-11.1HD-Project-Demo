
import paho.mqtt.client as mqtt         # Import the MQTT library

import RPi.GPIO as GPIO #importing lib
import time
from time import sleep
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)

#setting pins
SERVO = 11
FULL = 7 #Full LED
RESERVE = 10 #reserve led
RESERVE2 = 12
GPIO.setup(SERVO, GPIO.OUT)
GPIO.setup(FULL, GPIO.OUT)
GPIO.setup(RESERVE, GPIO.OUT)
GPIO.setup(RESERVE2, GPIO.OUT)
pwm=GPIO.PWM(SERVO, 50)
pwm.start(0)

def full():
    GPIO.output(FULL, GPIO.HIGH)
def notFull():
    GPIO.output(FULL,GPIO.LOW)
def reserve1():
    GPIO.output(RESERVE,GPIO.HIGH)
def reserve2():
    GPIO.output(RESERVE2, GPIO.HIGH)
def reserve1off():
    GPIO.output(RESERVE, GPIO.LOW)
def reserve2off():
    GPIO.output(RESERVE2, GPIO.LOW)
def servoOpen():
    pwm.ChangeDutyCycle(6) # left -90 deg position
    sleep(1)
    pwm.ChangeDutyCycle(0)
    sleep(5)
    pwm.ChangeDutyCycle(3) # left -90 deg position
    sleep(1)
    pwm.ChangeDutyCycle(0)

def on_connect (client,userdata,flags,rc):   #when connected to the server this function will run
    print("connected with result code " +str(rc))
    ourClient.subscribe("photonLog") # subscribe to the topic photonLog
# Our "on message" event
def messageFunction (client, userdata, message): #when a message is sent on a subscribed topic this function runs
    topic = str(message.topic) 
    message = str(message.payload.decode("utf-8")) #gets the message from the mqtt published
    print(topic + message)
    if( message == "arrive1"): #checking if the pay load arrive1
        servoOpen() #then runs the function
        reserve1off()
    if( message == "arrive2"): #checking if the pay load arrive2
        servoOpen() #then runs the function
        reserve2off()
    if( message == "full"):
        full()
    if( message == "notfull"):
        notFull()
    if( message == "reserve1"):
        reserve1()
    if( message == "reserve2"):
        reserve2()
    if( message == "reserve1off"):
        reserve1off()
    if( message == "reserve2off"):
        reserve2off()
ourClient = mqtt.Client("makerio_mqtt_365")     # Create a MQTT client object

# Subscribe to the topic AC_unit
ourClient.on_message = messageFunction      # Attach the messageFunction to subscription
ourClient.on_connect = on_connect

print("connecting to MQTT SERVER")
ourClient.connect("test.mosquitto.org", 1883)   # Connect to the test MQTT broker

ourClient.loop_start()              # Start the MQTT client and keep the connection alive
 
 
# Main program loop
while(1):
    time.sleep(1)               # Sleep for a second
