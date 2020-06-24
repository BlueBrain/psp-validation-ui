
import jsYaml from 'js-yaml';
import isNaN from 'lodash/isNaN';
import toNumber from 'lodash/toNumber';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  RowToYamlInterface,
  TableRowInterface,
  TableEntryObjectInterface,
} from '@/interfaces/table';

function getNumberOrFalseFromObj(obj: TableEntryObjectInterface) {
  const numb = toNumber(obj.value);
  return isNaN(numb) ? false : numb;
}

function convertObjToYaml(obj: TableRowInterface): string {
  const objToTransform: RowToYamlInterface = {
    /* eslint-disable @typescript-eslint/camelcase */
    pathway: {
      pre: obj.pathway.preSyn.value,
      post: obj.pathway.postSyn.value,
      constraints: {
        unique_gids: true,
        min_nsyn: getNumberOrFalseFromObj(obj.pathway.constraints.minNumSyn),
        max_nsyn: getNumberOrFalseFromObj(obj.pathway.constraints.maxNumSyn),
        max_dist_x: getNumberOrFalseFromObj(obj.pathway.constraints.maxDistX),
        max_dist_y: getNumberOrFalseFromObj(obj.pathway.constraints.maxDistY),
        max_dist_z: getNumberOrFalseFromObj(obj.pathway.constraints.maxDistZ),
      },
    },
    reference: {
      author: obj.reference.author.value,
      psp_amplitude: {
        mean: getNumberOrFalseFromObj(obj.reference.pspAmplitude.mean),
        std: getNumberOrFalseFromObj(obj.reference.pspAmplitude.std),
        link: obj.reference.pspAmplitude.link.value,
      },
      synapse_count: {
        mean: getNumberOrFalseFromObj(obj.reference.synapseCount.mean),
        std: getNumberOrFalseFromObj(obj.reference.synapseCount.std),
        link: obj.reference.synapseCount.link.value,
      },
    },
    protocol: {
      record_dt: getNumberOrFalseFromObj(obj.protocol.recordDt),
      hold_V: getNumberOrFalseFromObj(obj.protocol.holdV),
      t_stim: getNumberOrFalseFromObj(obj.protocol.tStim),
      t_stop: getNumberOrFalseFromObj(obj.protocol.tStop),
      post_ttx: getNumberOrFalseFromObj(obj.protocol.postTtx),
    },
  /* eslint-enable @typescript-eslint/camelcase */
  };
  const converted = jsYaml.dump(objToTransform);
  return converted;
}

function getYamlFilesFromData(rowsData: Array<TableRowInterface>): Array<string> {
  return rowsData.map((row: TableRowInterface) => convertObjToYaml(row));
}

function getPrePostNames(str: string): { pre: string; post: string } {
  const preRegex = /pre: (.+)/;
  const postRegex = /post: (.+)/;

  const preMatch = str.match(preRegex);
  if (!preMatch || !preMatch.length) {
    throw new Error('There is no Pre synaptic target');
  }

  const postMatch = str.match(postRegex);
  if (!postMatch || !postMatch.length) {
    throw new Error('There is no Post synaptic target');
  }

  return {
    pre: preMatch[1],
    post: postMatch[1],
  };
}

function exportRowsToZip(rowsData: Array<TableRowInterface>) {
  const files = getYamlFilesFromData(rowsData);

  const zip = new JSZip();

  files.forEach((yamlFile: string) => {
    const preAndPost = getPrePostNames(yamlFile);
    const fileName = `${preAndPost.pre}-${preAndPost.post}.yaml`;
    zip.file(fileName, yamlFile);
  });

  zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
    saveAs(content, 'pathways.zip');
  });
}

function transformYamlToObj(yaml: string) {
  return jsYaml.load(yaml);
}

export default {};

export {
  getYamlFilesFromData,
  getPrePostNames,
  exportRowsToZip,
  transformYamlToObj,
};
