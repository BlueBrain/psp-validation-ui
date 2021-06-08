
import json
import logging
import os
from tornado.web import Application, RequestHandler
from tornado import httpclient
from tornado.ioloop import IOLoop
from pymongo import MongoClient
from circuit_helper import CircuitHelper

L = logging.getLogger(__name__)
L.setLevel(logging.DEBUG)

DB_HOST = os.getenv('DB_HOST')
DEBUG = os.getenv('DEBUG')
DB_ENDPOINT = 'mongodb://{}:27017/psp'.format(DB_HOST)
L.info('Using mongo: %s', DB_ENDPOINT)
HBP_ENDPOINT = 'https://services.humanbrainproject.eu/idm/v1/api/user/me'
ALLOWED_ORIGIN = os.getenv('ALLOWED_ORIGIN', 'http://localhost:3000')

client = MongoClient(DB_ENDPOINT)
db = client.get_default_database()


class BaseHandler(RequestHandler):
  def set_default_headers(self):
    origin = self.request.headers.get('Origin', 'UNKNOWN')
    self.set_header('Access-Control-Allow-Origin', origin)
    self.set_header(
      'Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
    )
    self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    self.set_header('Content-Type', 'application/json')

  def options(self):
    # no body
    self.set_status(204)
    self.finish()

  async def prepare(self):
    origin = self.request.headers.get('Origin', None)
    if not origin:
      return

    is_allowed = self.check_allowed(origin)
    if not is_allowed:
      L.error(f'Origin [{origin}] not in [{ALLOWED_ORIGIN}]')
      self.set_status(403, 'Origin not allowed')
      self.finish()
  
  def check_allowed(self, origin):
    '''Check if origin is allowed'''
    return origin in ALLOWED_ORIGIN.split(',')


class LandingHandler(BaseHandler):
  async def get(self):
    self.write({'To check status use': '/api/status'})


class StatusHandler(BaseHandler):
  def get(self):
    L.debug('Showing status. Check DB conenction')
    self.do_find_validation() # to check the connection with the DB
    L.debug('DB connection correct')
    self.write({'status': 'OK'})
  
  def do_find_validation(self):
    document = db.validation_config.find_one()
    return document



class JobHandler(BaseHandler):
  async def get(self):
    L.debug('[Get] job')
    try:
      await validate_request(self.request)
    except Exception as e:
      L.error(e)
      self.set_status(400, str(e))
      self.finish()
      return

    unicore_job_id = self.get_argument('id')
    L.debug('ID: %s', unicore_job_id)

    if not unicore_job_id:
      return self.write({'message': 'Object not found'})

    document = self.get_validation_files_by_unicore_id(unicore_job_id)
    if not document:
      files = []
    else:
      files = document['files']
    return self.write(json.dumps(files))

  async def post(self):
    L.debug('[Post] job')
    try:
      await validate_request(self.request)
    except Exception as e:
      L.error(e)
      self.set_status(400, str(e))
      self.finish()
      return

    try:
      data = self.request.body
      L.debug('Data: %s', data)
      data_json = json.loads(data)
      self.do_insert(data_json)
      message = 'job was created'
    except:
      message = 'There was an error'

    self.write({'message': message})
  
  def get_validation_files_by_unicore_id(self, unicore_id):
    document = db.validation_config.find_one({'id': unicore_id})
    return document

  def do_insert(self, data):
    L.debug('[Insert] validations %s', data)
    db.validation_config.insert_one(data)


class CircuitHandler(BaseHandler):
  async def get(self):
    L.debug('[Get] circuits')
    try:
      await validate_request(self.request)
    except Exception as e:
      L.error(e)
      self.set_status(400, str(e))
      self.finish()
      return
    
    user_id = self.get_argument('user')

    circuits = self.get_circuit_list(user_id)
    json_list = json.dumps(circuits)
    return self.write(json_list)

  async def post(self):
    L.debug('[Post] circuits')
    try:
      await validate_request(self.request)
    except Exception as e:
      L.error(e)
      self.set_status(400, str(e))
      self.finish()
      return

    try:
      data = self.request.body
      data_json = json.loads(data)
      L.debug('data %s', data_json)
      self.insert_circuit_list(data_json)
      self.write({'message': 'circuits were saved'})
    except Exception as e:
      message = f'There was an error: {e}'
      self.write({'message': message})

  def get_circuit_list(self, user_id):
    document = db.circuits.find_one({'userId': user_id})
    if not document:
      return []
    return document['circuits']

  def insert_circuit_list(self, data_json):
    L.debug('[Insert] circuits %s', data_json)
    user_id = data_json['user']
    circuits = data_json['circuits']
    db.circuits.update_one(
      filter={'userId': user_id},
      update={'$set': {'circuits': circuits}},
      upsert=True)


async def validate_request(req):
  L.debug('Validating user ...')
  user_id = req.arguments.get('user')
  if not user_id:
    raise Exception('User id not present')

  L.debug('Validating auth token ...')
  token = req.headers.get('Authorization')
  if not token:
    raise Exception('Authorization not present')

  http_client = httpclient.AsyncHTTPClient()
  try:
    headers = {'Authorization': token}
    await http_client.fetch(HBP_ENDPOINT, headers=headers)
  except httpclient.HTTPError as e:
    error_message = e.response.body
    L.debug(error_message)
    raise Exception('Authorization not valid')
  L.debug('Authorization is valid')

def make_app():
  urls = [
    ('/', LandingHandler),
    ('/api', LandingHandler),
    ('/api/', LandingHandler),
    ('/api/status', StatusHandler),
    ('/api/circuits', CircuitHandler),
    ('/api/job', JobHandler),
    ('/api/snap', CircuitHelper),
  ]
  return Application(urls, db=db, debug=DEBUG)

if __name__ == '__main__':
  app = make_app()
  app.listen(3000)
  IOLoop.instance().start()
