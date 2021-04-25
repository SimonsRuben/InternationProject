
int Y = 0;
int X = 1000;
int Z = 0;
int toggle = 0;
unsigned long debounceTime = 100;
unsigned long currentTime;
int lastValue = 1;
bool low = LOW;

bool flag = false; 
volatile  int piezoPin = 2;

void setup() {
    Serial.begin(9600);
    attachInterrupt(digitalPinToInterrupt(piezoPin) , triggerSensor, CHANGE);
    pinMode(piezoPin, INPUT_PULLUP);
}

void loop() {
  Y = digitalRead(piezoPin);
  lastValue = Y;

  if(flag == true && (millis() - currentTime) > debounceTime){
      flag = false;
      interrupts();
     // Serial.println("enabled");
      toggle = 0;
    }
}

void readSensor(){
  if(digitalRead(piezoPin) == low && lastValue != low){
       Serial.println("HIT"); // Or how ever they need the signal
       //interrupts();
    }
  }

void triggerSensor () {
  //Serial.println("TRIGGER");
  
  noInterrupts();
  //Serial.println("disabled");
  currentTime = millis();
  if(toggle == 0){
  readSensor();
  }
  flag = true;
  toggle = 1;
}
