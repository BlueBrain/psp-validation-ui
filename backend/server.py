
from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
from tornado.log import enable_pretty_logging
from pymongo import MongoClient
import datetime
import json
import logging

client = MongoClient('localhost', 27017)
db = client['psp']

L = logging.getLogger(__name__)
L.setLevel(logging.DEBUG)


class StatusHandler(RequestHandler):
  def get(self):
    L.debug('Showing status. Check DB conenction')
    do_find_validation() # to check the connection with the DB
    L.debug('DB connection correct')
    self.write({'status': 'OK'})


class JobHandler(RequestHandler):
  def set_default_headers(self):
    self.set_header("Access-Control-Allow-Origin", "*")
    self.set_header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    self.set_header("Content-Type", 'application/json')

  def options(self):
    # no body
    self.set_status(204)
    self.finish()

  def get(self):
    L.debug('[Get] job')
    unicore_job_id = self.get_argument("id")
    L.debug('ID: %s', unicore_job_id)
    
    if not unicore_job_id:
      return self.write({'message': 'Object not found'})
    
    document = do_find_validation_by_unicore_id(unicore_job_id)
    files = document['files']
    self.write(json.dumps(files))

  def post(self):
    L.debug('[Post] job')
    try:
      data = self.request.body
      L.debug('Data: %s', data)
      data_json = json.loads(data)
      do_insert(data_json)
      message = 'job was created'
    except:
      message = 'There was an error'

    self.write({'message': message})


class CircuitHandler(RequestHandler):
  def set_default_headers(self):
    self.set_header("Access-Control-Allow-Origin", "*")
    self.set_header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    self.set_header("Content-Type", 'application/json')

  def options(self):
    # no body
    self.set_status(204)
    self.finish()

  def get(self):
    L.debug('[Get] circuits')
    user_id = self.get_argument("user")
    
    if not user_id:
      return self.write({'message': 'User not found'})

    circuits = get_circuit_list(user_id)
    json_list = json.dumps(circuits)
    self.write(json_list)

  def post(self):
    L.debug('[Post] circuits')
    try:
      data = self.request.body
      data_json = json.loads(data)
      L.debug('data %s', data_json)
      insert_circuit_list(data_json)
      message = 'circuits were saved'
    except:
      message = 'There was an error'

    self.write({'message': message})


def get_circuit_list(user_id):
  document = db.circuits.find_one({'userId': user_id})
  return document['circuits']

def insert_circuit_list(data_json):
  L.debug('[Insert] circuits %s', data_json)
  user_id = data_json['user']
  circuits = data_json['circuits']
  db.circuits.update_one(
    filter={'userId': user_id},
    update={"$set": {'circuits': circuits}},
    upsert=True)

def do_find_validation():
  document = db.validation_config.find_one()
  return document

def do_find_validation_by_unicore_id(unicore_id):
  document = db.validation_config.find_one({'id': unicore_id})
  return document

def do_insert(data):
  L.debug('[Insert] validations %s', data)
  db.validation_config.insert_one(data)

def make_app():
  urls = [
    ("/", StatusHandler),
    ("/api/job", JobHandler),
    ("/api/circuits", CircuitHandler),
  ]
  return Application(urls, db=db, debug=True)

if __name__ == '__main__':
    app = make_app()
    app.listen(3000)
    IOLoop.instance().start()
