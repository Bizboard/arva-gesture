// Frontend Imports
import EventEmitter from './EventEmitter';
var eventHandler = new EventEmitter();

if (require) {

    // Backend Imports
    var MyoBluetooth = require('MyoNodeBluetooth');

    var myoAgent = new MyoBluetooth();
    var armband = null;


    myoAgent.on('discovered', function (_armband) {
        console.log('discovered armband: ', armband);
        armband = _armband;
        armband.on('connect', function (connected) {
            console.log('connect: ', connected);
            if (connected == true) {
                console.log('connected');

                // start notifying Emg, IMU and Classifier characteristics
                armband.initStart();

            } else {
                console.log('disconnected!');
            }
        });

        armband.on('ready', function () {
            armband.on('pose', function (data) {
                console.log('received pose:', data.type);
                eventHandler.emit(data.type);
            }.bind(this));
        });

        armband.connect();
    }.bind(this));


    myoAgent.on('stateChange', function (state) {
        console.log('StateChange ', state);
    });
}

export default eventHandler;