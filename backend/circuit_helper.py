
import logging
from pathlib import Path
from tornado.web import RequestHandler

L = logging.getLogger(__name__)
L.setLevel(logging.DEBUG)


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


class CircuitHelper(BaseHandler):

  def get(self):
    L.debug('[Get] Fetch Circuit Information')
    circuit_path = self.get_argument("path")
    L.debug('Path: %s', circuit_path)

    checks_result = process_path(circuit_path)
    if not checks_result['is_ok']:
      return self.write({'error': checks_result['message']})

    result_dict = {}
    if checks_result['is_sonata']:
      L.debug('Is Sonata Circuit')
      try:
        result_dict = get_mtype_and_synapse_sonata(circuit_path)
      except Exception as e:
        L.error(e, exc_info=True)
        return self.write({'error': str(e)})
      L.debug(result_dict)
    else:
      L.debug('Is Legacy Circuit')
      try:
        result_dict = get_mtype_and_synapse_legacy(circuit_path)
      except Exception as e:
        L.error(e, exc_info=True)
        return self.write({'error': str(e)})
      L.debug(result_dict)

    return self.write({'results': result_dict})


def process_path(circuit_path):
  p = Path(circuit_path)

  checks_result = {
    'message': '',
    'is_ok': False,
    'is_sonata': False,
  }

  if not p.exists():
    checks_result['message'] = 'Path does not exist'
    return checks_result

  if p.is_dir():
    checks_result['message'] = 'Path is directory. Provide the CircuitConfig or circuit_config.json path'
    return checks_result

  if p.suffix == '.json':
    checks_result['is_sonata'] = True
    checks_result['message'] = ''
    checks_result['is_ok'] = True
    return checks_result

  if p.suffix == '': # treat as CircuitConfig
    checks_result['is_sonata'] = False
    checks_result['message'] = ''
    checks_result['is_ok'] = True
    return checks_result

  checks_result['message'] = 'Error in path'
  return checks_result


def get_mtype_and_synapse_sonata(circuit_path):
  from bluepysnap import Circuit
  circuit = Circuit(circuit_path)

  if not circuit.nodes:
    raise ValueError('No Circuit Nodes')

  node_population = circuit.nodes[get_neuron_node(circuit)]
  L.debug("Population size: %s", node_population.size)

  mtypes = node_population.property_values('mtype')
  synapse_classes = node_population.property_values('synapse_class')
  return {
    'm_types': list(mtypes),
    'synapse_classes': list(synapse_classes),
  }

def get_neuron_node(circuit):
  nodes = circuit.nodes.items()
  if len(nodes) > 1:
    populations = list(circuit.nodes.keys())
    L.debug('Has multiple nodes %s', populations)
    neuron_populations = [p for p in populations if 'neurons' in p]
    if not neuron_populations:
      raise ValueError('no Neuron population in nodes')
    population = neuron_populations[0]
  else:
    population = list(circuit.nodes.keys())[0]
    L.debug('Selecting the only %s', population)
  return population

def get_mtype_and_synapse_legacy(circuit_path):
  from bluepy.v2 import Circuit
  circuit = Circuit(circuit_path)
  mtypes = circuit.cells.mtypes
  # as circuit.cells.synapse_class fails
  synapse_classes = set(['INH', 'EXC'])
  return {
    'm_types': list(mtypes),
    'synapse_classes': list(synapse_classes),
  }
