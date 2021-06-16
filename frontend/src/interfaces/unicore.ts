
interface UrlToComputerAndIdInterface {
  computer: string | null;
  id: string | null;
}

interface HPCComputer {
  name: string;
  id: string;
  url: string;
}

interface HPCDefinition {
  [key: string]: HPCComputer;
}

interface DataToUpload {
  Data: string;
  To: string;
}

interface UnicoreJobDefinition {
  // TODO be less flexible here
  Name?: string;
  Executable?: string;
  Arguments?: never[];
  haveClientStageIn?: string;
  Resources?: {
    Nodes?: number;
    CPUsPerNode?: number;
    Runtime?: string | number;
    Memory?: string | number;
    NodeConstraints?: string;
    Queue?: string;
  }
  Tags?: string[];
  // TODO: check if this is correct
  Imports?: DataToUpload[];
}

interface GeneralJobDefinition {
  title: string;
  runtime: string | number;
  nodes: number;
  cpusPerNode?: number;
  memory: number | string;
  project: string;
  executable: string;
  tags: Array<string>;
  nodeType: string;
  imports: Array<DataToUpload>;
  queue: string;
}

interface JobProperties {
  acl: []
  currentTime: string;
  exitCode: string;
  id: string;
  log: Array<string>;
  name: string;
  owner: string;
  queue: string;
  resourceStatus: string;
  status: string;
  statusMessage: string;
  submissionPreferences: { UC_OAUTH_BEARER_TOKEN: Array<string> }
  submissionTime: string;
  tags: []
  terminationTime: string;
  _links: {
    self: {
      href: string;
    }
    workingDirectory: {
      href: string;
    }
    'action:start': {
      href: string;
    }
  }
}

interface FileObjInterface {
  [key: string]: {
    owner: string;
    size: number;
    lastAccessed: Date;
    isDirectory: boolean;
    group: string;
  }
}

interface UnicoreJobFiles {
  owner: string;
  size: number;
  children: Array<string>;
  _links:{
    next:{
      href: string;
    }
    self:{
      href: string;
    }
    parentStorage:{
      description: string;
      href: string;
    }
  }
  lastAccessed: Date;
  isDirectory: string;
  content: FileObjInterface
}

interface ValidationConfigInterface {
  pairs: string;
  trials: string;
  yamlFiles: string;
  saveTraces: string;
  saveAmplitudes: string;
}

export default {};

export {
  UrlToComputerAndIdInterface,
  UnicoreJobDefinition,
  GeneralJobDefinition,
  DataToUpload,
  JobProperties,
  HPCComputer,
  HPCDefinition,
  UnicoreJobFiles,
  FileObjInterface,
  ValidationConfigInterface,
};
