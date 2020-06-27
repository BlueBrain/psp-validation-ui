
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

interface UnicoreJobDefinition {
  // TODO be less flexible here
  Name?: string;
  Executable?: string;
  Arguments?: never[];
  Parameters?: {};
  haveClientStageIn?: string;
  Resources?: {
    Nodes?: number | null;
    CPUsPerNode?: number;
    Runtime?: number;
    NodeConstraints?: string;
    Queue?: string;
  }
  Tags?: string[] | null;
  // TODO: check if this is correct
  Imports?: DataToUpload[];
}

interface GeneralJobDefinition {
  title: string | null;
  runtime: number;
  cpus: number;
  memory: string;
  project: string;
  executable: string | null;
  tags: Array<string> | null;
  imports: Array<DataToUpload>;
}

interface DataToUpload {
  Data: string;
  To: string;
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
  content: Array<FileObjInterface>
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
};
