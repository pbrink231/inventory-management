import fs from 'fs';
import path from 'path';

// const fs = require('fs');
// const path = require('path');

const updateJsonTypes = async () => {
  // append import string to the first line of index.d.ts
  const baseFolder = path.resolve();
  const indexTypesPath = path.resolve(baseFolder, './src/db/types/index.d.ts');
  const indexTypes = fs.readFileSync(indexTypesPath, 'utf8');

  const jsonTypesImport = `import { JsonAddress } from './jsonTypes'`;

  let indexedFileReplace = indexTypes;
  if (!indexTypes.includes(jsonTypesImport)) {
    indexedFileReplace = jsonTypesImport + '\n' + indexedFileReplace;
  }

  // replace JsonAddress in index.d.ts with JsonAddress from jsonTypes.d.ts
  const replaceMapArray: { fromString: string; toString: string }[] = [
    {
      fromString: `address: Json | null;`,
      toString: `address: JsonAddress | null;`
    },
    {
      fromString: `option_1_values: Json | null;`,
      toString: `option_1_values: string[] | null;`
    },
    {
      fromString: `option_2_values: Json | null;`,
      toString: `option_2_values: string[] | null;`
    },
    {
      fromString: `option_3_values: Json | null;`,
      toString: `option_3_values: string[] | null;`
    }
  ];
  for (const replaceMap of replaceMapArray) {
    indexedFileReplace = indexedFileReplace.replace(replaceMap.fromString, replaceMap.toString);
  }
  fs.writeFileSync(indexTypesPath, indexedFileReplace);

  console.log('Json types updated');
};

updateJsonTypes();
