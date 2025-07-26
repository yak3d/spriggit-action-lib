import { downloadFileToDestination } from '../http/http';
import { unzipFile } from '../zip/unzip';
import path from 'path';
import * as fs from 'fs';

const spriggitZipName = 'SpriggitLinuxCLI.zip';
const spriggitZipPath = path.join('./', spriggitZipName);
const spriggitPath = path.join('./', 'spriggit');
const spriggitCli = path.join(spriggitPath, 'Spriggit.CLI');

export const downloadSpriggit = async (version: string): Promise<string> => {
  const url = `https://github.com/Mutagen-Modding/Spriggit/releases/download/${version}/${spriggitZipName}`;

  try {
    console.log(`Downloading Spriggit ${version} to ${spriggitZipPath}`);
    await downloadFileToDestination(url, spriggitZipPath);
    console.log(`Successfully downloaded Spriggit ${version}`);

    console.log(`Extracting spriggit to ${spriggitPath}`);
    await unzipFile(spriggitZipPath, spriggitPath);
    console.log('Spriggit extracted successfully');

    console.log(`Giving +x permission to ${spriggitCli}`);
    fs.chmodSync(spriggitCli, '755');
  } catch (error) {
    console.error('There was an error downloading Spriggit', error);
  }
};
