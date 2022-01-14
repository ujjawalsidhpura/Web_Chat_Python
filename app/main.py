from distutils.log import debug
from flask import session
from flask_socketio import SocketIO
import time
import json
from application import create_app
from application.database import Database, save_message
import config

# Setup
app = create_app()
socketio = SocketIO(app)  # User Communication

# Communication Function


@socketio.on('event')
def handle_event(json, methods=['GET', 'POST']):
    '''
    This function handles saving messages once received from server and sends messages to clients.
    --param json: json
    --param methods: GET POST
    --return: None
    '''
    data = dict(json)
    if 'name' in data:
        db = Database()
        db = save_message(data['name'], data['message'])


socketio.emit('message response', json)


if __name__ == '__main__':
    socketio.run(app, debug=True, host=str(config.Config.SERVER))
