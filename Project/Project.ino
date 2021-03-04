#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>
#include "FS.h"
#include "SD.h"
#include "SPI.h"
#include "PubSubClient.h" //Connect and publish to the MQTT broker
#include "WiFi.h" //Enables the EPS32 to connect to local network (via wifi)

/* This code uses the Adafruit unified sensor library (Adafruit_Sensor),
   which provides a common 'type' for sensor data and some helper functions.

   To use this driver you will also need to download the Adafruit_Sensor
   library and include it in your libraries folder.

   You should also assign a unique ID to this sensor for use with
   the Adafruit Sensor API so that you can identify this particular
   sensor in any data logs, etc.

   Connections
   ===========
   Connect SCL to analog 5
   Connect SDA to analog 4
   Connect VDD to 3.3-5V DC
   Connect GROUND to common ground

/*
 * Connect the SD card to the following pins:
 *
 * SD Card | ESP32
 *    D2       -
 *    D3       33
 *    CMD      MOSI
 *    VSS      GND
 *    VDD      3.3V
 *    CLK      SCK
 *    VSS      GND
 *    D0       MISO
 *    D1       -
 */
 
/* Set the delay between fresh samples */
uint16_t BNO055_SAMPLERATE_DELAY_MS = 10;

//Variables
byte Use_SD_Card = false;
byte MQTT_working = false;
byte Lau = 0;
byte Aika_vali = 0;
String dataMessage;

// Check I2C device address and correct line below (by default address is 0x29 or 0x28)
//                                   id, address
Adafruit_BNO055 bno = Adafruit_BNO055(55, 0x28);

//wifi information
const char* ssid = "Raspberry-Hotspot"; //Type your wifi ssid (name) here
const char* wifi_password = "fantastinenburgeri"; //Type your wifi password here

//MQTT information
const char* mqtt_server = "192.168.1.1"; //IP of your MQTT broker
const char* mqtt_username = "testi"; //MQTT username
const char* mqtt_password = "1234"; //MQTT password
const char* clientID = "Player_1"; //MQTT client ID
const char* Linear_acceleration_topic = "Linear acceleration";
const char* Shots_topic = "Shots taken";
/*
//Initialisig wifi and MQTT client objects
WiFiClient wifiClient;
//Broker is listening 1883 port
PubSubClient client(mqtt_server, 1883, wifiClient);
*/
void setup(void){
  Serial.begin(115200);

  Serial.println("Orientation Sensor Test"); Serial.println("");

  /* Initialise the sensor */
  if(!bno.begin())
  {
    /* There was a problem detecting the BNO055 ... check your connections */
    Serial.print("Ooops, no BNO055 detected ... Check your wiring or I2C ADDR!");
    //while (1);
  }
  if(!SD.begin()){
    Serial.println("Card Mount Failed");
    Serial.println("  ");
  }
//SD card type
    uint8_t cardType = SD.cardType();

    if(cardType == CARD_NONE){
        Serial.println("No SD card attached");
        Serial.println("  ");
    }

    Serial.print("SD Card Type: ");
    if(cardType == CARD_MMC){
        Serial.println("MMC");
    } else if(cardType == CARD_SD){
        Serial.println("SDSC");
    } else if(cardType == CARD_SDHC){
        Serial.println("SDHC");
    } else {
        Serial.println("UNKNOWN");
    }

    uint64_t cardSize = SD.cardSize() / (1024 * 1024);
    Serial.printf("SD Card Size: %lluMB\n", cardSize);

    listDir(SD, "/", 0);
    createDir(SD, "/mydir");
    listDir(SD, "/", 0);
    removeDir(SD, "/mydir");
    listDir(SD, "/", 2);
    writeFile(SD, "/hello.txt", "Hello ");
    appendFile(SD, "/hello.txt", "World!\n");
    readFile(SD, "/hello.txt");
    deleteFile(SD, "/foo.txt");
    renameFile(SD, "/hello.txt", "/foo.txt");
    readFile(SD, "/foo.txt");
    testFileIO(SD, "/test.txt");
    Serial.printf("Total space: %lluMB\n", SD.totalBytes() / (1024 * 1024));
    Serial.printf("Used space: %lluMB\n", SD.usedBytes() / (1024 * 1024));
/*
  connect_wifi();
  delay(100);
  connect_MQTT();
  delay(1000);*/
  createDir(SD, "/Data");
  writeFile(SD, "Data/data.txt", "Data of the game\n");
  }
  
void loop(void){
/*
if(WiFi.status()!= WL_CONNECTED){
  Use_SD_Card = true;
  connect_wifi();
}
//Uncomment when MQTT server is up

if(MQTT_working == false);{
  connect_MQTT();
}*/
//Uncomment when MQTT server is up
  
  //could add VECTOR_ACCELEROMETER, VECTOR_MAGNETOMETER,VECTOR_GRAVITY...
  sensors_event_t orientationData , angVelocityData , linearAccelData, magnetometerData, accelerometerData, gravityData;
  bno.getEvent(&orientationData, Adafruit_BNO055::VECTOR_EULER);
  bno.getEvent(&angVelocityData, Adafruit_BNO055::VECTOR_GYROSCOPE);
  bno.getEvent(&linearAccelData, Adafruit_BNO055::VECTOR_LINEARACCEL);
  bno.getEvent(&magnetometerData, Adafruit_BNO055::VECTOR_MAGNETOMETER);
  bno.getEvent(&accelerometerData, Adafruit_BNO055::VECTOR_ACCELEROMETER);
  bno.getEvent(&gravityData, Adafruit_BNO055::VECTOR_GRAVITY);

  printEvent(&orientationData);
  printEvent(&linearAccelData);
  printEvent(&accelerometerData);

  int8_t boardTemp = bno.getTemp();
  Serial.println();
  Serial.print(F("temperature: "));
  Serial.println(boardTemp);

  uint8_t system, gyro, accel, mag = 0;
  bno.getCalibration(&system, &gyro, &accel, &mag);
  Serial.println();
  Serial.print("Calibration: Sys=");
  Serial.print(system);
  Serial.print(" Gyro=");
  Serial.print(gyro);
  Serial.print(" Accel=");
  Serial.print(accel);
  Serial.print(" Mag=");
  Serial.println(mag);
  Serial.print("Lyönnit");
  Serial.println(Lau);
  
//Uncomment when MQTT server is up
/*
String SH=String((byte)Lau);

if(client.publish(Shots_topic, String(SH).c_str())){
  Serial.println("Number of shots sent");
}
else{
  Serial.println("Failed to send data. Reconnecting and trying again");
  connect_MQTT();
  delay(10);
  client.publish(Shots_topic, String(SH).c_str());
}*/
//Uncomment when MQTT server is up
  Serial.println("--");
  delay(BNO055_SAMPLERATE_DELAY_MS);
}

void printEvent(sensors_event_t* event) {
  double x = -1000000, y = -1000000 , z = -1000000; //dumb values, easy to spot problem
  if (event->type == SENSOR_TYPE_ACCELEROMETER) {
    Serial.print("Accl:");
    x = event->acceleration.x;
    y = event->acceleration.y;
    z = event->acceleration.z;

    dataMessage = "Accl: x:" + String(x) + " y:" + String(y) + " z:" + String(z) + "\n";
    appendFile(SD, "/Data/data.txt", dataMessage.c_str());

  }
  else if (event->type == SENSOR_TYPE_ORIENTATION) {
    Serial.print("Orient:");
    x = event->orientation.x;
    y = event->orientation.y;
    z = event->orientation.z;

    dataMessage = "Orient: x:" + String(x) + " y:" + String(y) + " z:" + String(z )+ "\n";
    appendFile(SD, "/Data/data.txt", dataMessage.c_str());

  if(Aika_vali > 100){
     if(x > 190 && z < -30 && y < 55){
        Lau = Lau + 1;
        Aika_vali = 0;
    }
  }
 Aika_vali = Aika_vali + 1;
}
  else if (event->type == SENSOR_TYPE_LINEAR_ACCELERATION) {
    Serial.print("Linear:");
    x = event->acceleration.x;
    y = event->acceleration.y;
    z = event->acceleration.z;    
    
    if(x < 0){
      x = -x;
    }
    if (y < 0){
      y = -y;
    }
    if (z < 0){
      z = -z;
    }

    dataMessage =  "Linear: x:" + String(x) + " y:" + String(y) + " z:" + String(z) + "\n";
    appendFile(SD, "/Data/data.txt", dataMessage.c_str());
//Uncomment when MQTT server is up
/*
   String ACCX="Linear acceleration x axel: "+String((double)x);
   String ACCY="Linear acceleration y axel: "+String((double)y);
   String ACCZ="Linear acceleration z axel: "+String((double)z);   

  if(client.publish(Linear_acceleration_topic, String(x).c_str())){
    Serial.println("Linear acceleration x axel sent");
  }
  else if(client.publish(Linear_acceleration_topic, String(y).c_str())){
    Serial.println("Linear acceleration y axel sent");
  }
  else if(client.publish(Linear_acceleration_topic, String(z).c_str())){
    Serial.println("Linear acceleration z axel sent"); 
  } 

  else{
   Serial.println("Failed to send data. Reconnecting to MQTT Broker and trying again");
   connect_MQTT();
   delay(10);
   client.publish(Linear_acceleration_topic, String(x).c_str());
   client.publish(Linear_acceleration_topic, String(y).c_str());
   client.publish(Linear_acceleration_topic, String(z).c_str());
  }
  //Uncomment when MQTT server is up
  */
}
  else {
    Serial.print("Unk:");
  }
  Serial.print("\tx= ");
  Serial.print(x);
  Serial.print(" |\ty= ");
  Serial.print(y);
  Serial.print(" |\tz= ");
  Serial.println(z);
}

void listDir(fs::FS &fs, const char * dirname, uint8_t levels){
    Serial.printf("Listing directory: %s\n", dirname);

    File root = fs.open(dirname);
    if(!root){
        Serial.println("Failed to open directory");
        return;
    }
    if(!root.isDirectory()){
        Serial.println("Not a directory");
        return;
    }

    File file = root.openNextFile();
    while(file){
        if(file.isDirectory()){
            Serial.print("  DIR : ");
            Serial.println(file.name());
            if(levels){
                listDir(fs, file.name(), levels -1);
            }
        } else {
            Serial.print("  FILE: ");
            Serial.print(file.name());
            Serial.print("  SIZE: ");
            Serial.println(file.size());
        }
        file = root.openNextFile();
    }
}

void createDir(fs::FS &fs, const char * path){
    Serial.printf("Creating Dir: %s\n", path);
    if(fs.mkdir(path)){
        Serial.println("Dir created");
    } else {
        Serial.println("mkdir failed");
    }
}

void removeDir(fs::FS &fs, const char * path){
    Serial.printf("Removing Dir: %s\n", path);
    if(fs.rmdir(path)){
        Serial.println("Dir removed");
    } else {
        Serial.println("rmdir failed");
    }
}

void readFile(fs::FS &fs, const char * path){
    Serial.printf("Reading file: %s\n", path);

    File file = fs.open(path);
    if(!file){
        Serial.println("Failed to open file for reading");
        return;
    }

    Serial.print("Read from file: ");
    while(file.available()){
        Serial.write(file.read());
    }
    file.close();
}

void writeFile(fs::FS &fs, const char * path, const char * message){
    Serial.printf("Writing file: %s\n", path);

    File file = fs.open(path, FILE_WRITE);
    if(!file){
        Serial.println("Failed to open file for writing");
        return;
    }
    if(file.print(message)){
        Serial.println("File written");
    } else {
        Serial.println("Write failed");
    }
    file.close();
}

void appendFile(fs::FS &fs, const char * path, const char * message){
    Serial.printf("Appending to file: %s\n", path);

    File file = fs.open(path, FILE_APPEND);
    if(!file){
        Serial.println("Failed to open file for appending");
        return;
    }
    if(file.print(message)){
        Serial.println("Message appended");
    } else {
        Serial.println("Append failed");
    }
    file.close();
}

void renameFile(fs::FS &fs, const char * path1, const char * path2){
    Serial.printf("Renaming file %s to %s\n", path1, path2);
    if (fs.rename(path1, path2)) {
        Serial.println("File renamed");
    } else {
        Serial.println("Rename failed");
    }
}

void deleteFile(fs::FS &fs, const char * path){
    Serial.printf("Deleting file: %s\n", path);
    if(fs.remove(path)){
        Serial.println("File deleted");
    } else {
        Serial.println("Delete failed");
    }
}

void testFileIO(fs::FS &fs, const char * path){
    File file = fs.open(path);
    static uint8_t buf[512];
    size_t len = 0;
    uint32_t start = millis();
    uint32_t end = start;
    if(file){
        len = file.size();
        size_t flen = len;
        start = millis();
        while(len){
            size_t toRead = len;
            if(toRead > 512){
                toRead = 512;
            }
            file.read(buf, toRead);
            len -= toRead;
        }
        end = millis() - start;
        Serial.printf("%u bytes read for %u ms\n", flen, end);
        file.close();
    } else {
        Serial.println("Failed to open file for reading");
    }


    file = fs.open(path, FILE_WRITE);
    if(!file){
        Serial.println("Failed to open file for writing");
        return;
    }

    size_t i;
    start = millis();
    for(i=0; i<2048; i++){
        file.write(buf, 512);
    }
    end = millis() - start;
    Serial.printf("%u bytes written for %u ms\n", 2048 * 512, end);
    file.close();
}

//Custom function to connet to the wifi
void connect_wifi(){
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, wifi_password);

  for (byte i = 0; i < 5; i++){
    Serial.println("Trying to connect");
    delay(1000);
  }

//Connecting to wifi
 while (WiFi.status()!= WL_CONNECTED) {
    Serial.println("WiFi connection lost trying to reconnect ");
    WiFi.begin(ssid, wifi_password);
    delay(5000);
    }

  //Debugging - Output the IP address of the EPS32
  Serial.println("WiFi connected");
  Serial.print("IP address");
  Serial.print(WiFi.localIP());
  
  Use_SD_Card = false;
}
//Custom function to connet to MQTT
/*
void connect_MQTT(){
  //Connect to MQTT Broker
  //client.connect returns a boolean value to let us know if the connection was successful
  //If you can't from a connection, make sure you are using the correct MQTT Username and Password
  if(client.connect(clientID, mqtt_username, mqtt_password)){
    Serial.println("Connected to MQTT Broker");
    MQTT_working = true; 
  }
  else{
    Serial.println("Connection to MQTT Broker failed");
    MQTT_working = false;
  }
}*/
