
import json
import logging
import os
from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
from pymongo import MongoClient
from circuit_helper import CircuitHelper

L = logging.getLogger(__name__)
L.setLevel(logging.DEBUG)

DB_HOST = os.getenv('DB_HOST')
DEBUG = os.getenv('DEBUG')
DB_ENDPOINT = 'mongodb://{}:27017/psp'.format(DB_HOST)
L.info('Using mongo: %s', DB_ENDPOINT)
client = MongoClient(DB_ENDPOINT)

db = client.get_default_database()

class BaseHandler(RequestHandler):
  def set_default_headers(self):
    self.set_header("Access-Control-Allow-Origin", "*")
    self.set_header("Access-Control-Allow-Headers",
                    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    self.set_header("Content-Type", 'application/json')

  def options(self):
    # no body
    self.set_status(204)
    self.finish()


class StatusHandler(BaseHandler):
  def get(self):
    L.debug('Showing status. Check DB conenction')
    do_find_validation() # to check the connection with the DB
    L.debug('DB connection correct')
    self.write({'status': 'OK'})


class LandingHandler(BaseHandler):
  def get(self):
    self.write({'To check status use': '/api/status'})


class JobHandler(BaseHandler):
  def get(self):
    L.debug('[Get] job')
    unicore_job_id = self.get_argument("id")
    L.debug('ID: %s', unicore_job_id)

    if not unicore_job_id:
      return self.write({'message': 'Object not found'})

    document = get_validation_files_by_unicore_id(unicore_job_id)
    if not document:
      files = []
    else:
      files = document['files']
    return self.write(json.dumps(files))

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


class CircuitHandler(BaseHandler):
  def get(self):
    L.debug('[Get] circuits')
    user_id = self.get_argument("user")

    if not user_id:
      return self.write({'message': 'User not found'})

    circuits = get_circuit_list(user_id)
    json_list = json.dumps(circuits)
    return self.write(json_list)

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
  if not document:
    return []
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

def get_validation_files_by_unicore_id(unicore_id):
  document = db.validation_config.find_one({'id': unicore_id})
  return document

def do_insert(data):
  L.debug('[Insert] validations %s', data)
  db.validation_config.insert_one(data)

def make_app():
  urls = [
    ("/api", LandingHandler),
    ("/", LandingHandler),
    ("/api/", LandingHandler),
    ("/api/status", StatusHandler),
    ("/api/job", JobHandler),
    ("/api/circuits", CircuitHandler),
    ("/api/snap", CircuitHelper),
  ]
  return Application(urls, db=db, debug=DEBUG)

if __name__ == '__main__':
  app = make_app()
  app.listen(3000)
  IOLoop.instance().start()
