
from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
from pymongo import MongoClient
import datetime
import json

client = MongoClient('localhost', 27017)
db = client['psp']



class StatusHandler(RequestHandler):
  def get(self):
    do_find_validation() # to check the connection with the DB
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
    unicore_job_id = self.get_argument("id")
    
    if not unicore_job_id:
      return self.write({'message': 'Object not found'})
    
    document = do_find_validation_by_unicore_id(unicore_job_id)
    files = document['files']
    self.write(json.dumps(files))

  def post(self):
    try:
      data = self.request.body
      data_json = json.loads(data)
      do_insert(data_json)
      message = 'job was created'
    except:
      message = 'There was an error'

    self.write({'message': message})


def do_find_one():
  document = db.validation_config.find_one()
  return document

def do_find_validation_by_unicore_id(unicore_id):
  document = db.validation_config.find_one({'id': unicore_id})
  return document

def do_insert(data):
  db.validation_config.insert_one(data)

def make_app():
  urls = [
    ("/", StatusHandler),
    ("/api/job", JobHandler),
  ]
  return Application(urls, db=db, debug=True)

if __name__ == '__main__':
    app = make_app()
    app.listen(3000)
    IOLoop.instance().start()
