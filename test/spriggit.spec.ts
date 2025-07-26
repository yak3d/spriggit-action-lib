import { downloadSpriggit } from '../src/spriggit/spriggit';
import { downloadFileToDestination } from '../src/http/http';
import { unzipFile } from '../src/zip/unzip';
import * as fs from 'fs';

// Mock the dependencies
jest.mock('../src/http/http');
jest.mock('../src/zip/unzip');
jest.mock('fs', () => ({
  chmodSync: jest.fn(),
}));

describe('spriggit', () => {
  const mockDownloadFileToDestination =
    downloadFileToDestination as jest.MockedFunction<
      typeof downloadFileToDestination
    >;
  const mockUnzipFile = unzipFile as jest.MockedFunction<typeof unzipFile>;
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('downloadSpriggit', () => {
    it('should successfully download and extract Spriggit', async () => {
      const version = 'v1.2.3';
      const expectedUrl = `https://github.com/Mutagen-Modding/Spriggit/releases/download/${version}/SpriggitLinuxCLI.zip`;
      const expectedZipPath = 'SpriggitLinuxCLI.zip';
      const expectedExtractPath = 'spriggit';
      const expectedCliPath = 'spriggit/Spriggit.CLI';

      mockDownloadFileToDestination.mockResolvedValue();
      mockUnzipFile.mockResolvedValue();
      mockFs.chmodSync.mockImplementation();

      await downloadSpriggit(version);

      expect(mockDownloadFileToDestination).toHaveBeenCalledWith(
        expectedUrl,
        expectedZipPath
      );
      expect(mockUnzipFile).toHaveBeenCalledWith(
        expectedZipPath,
        expectedExtractPath
      );
      expect(mockFs.chmodSync).toHaveBeenCalledWith(expectedCliPath, '755');

      expect(console.log).toHaveBeenCalledWith(
        `Downloading Spriggit ${version} to ${expectedZipPath}`
      );
      expect(console.log).toHaveBeenCalledWith(
        `Successfully downloaded Spriggit ${version}`
      );
      expect(console.log).toHaveBeenCalledWith(
        `Extracting spriggit to ${expectedExtractPath}`
      );
      expect(console.log).toHaveBeenCalledWith(
        'Spriggit extracted successfully'
      );
      expect(console.log).toHaveBeenCalledWith(
        `Giving +x permission to ${expectedCliPath}`
      );
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should handle download errors gracefully', async () => {
      const version = 'v1.2.3';
      const downloadError = new Error('Network error');

      mockDownloadFileToDestination.mockRejectedValue(downloadError);

      await downloadSpriggit(version);

      expect(mockDownloadFileToDestination).toHaveBeenCalled();
      expect(mockUnzipFile).not.toHaveBeenCalled();
      expect(mockFs.chmodSync).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        'There was an error downloading Spriggit',
        downloadError
      );
    });

    it('should handle extraction errors gracefully', async () => {
      const version = 'v1.2.3';
      const extractError = new Error('Extraction failed');

      mockDownloadFileToDestination.mockResolvedValue();
      mockUnzipFile.mockRejectedValue(extractError);

      await downloadSpriggit(version);

      expect(mockDownloadFileToDestination).toHaveBeenCalled();
      expect(mockUnzipFile).toHaveBeenCalled();
      expect(mockFs.chmodSync).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        'There was an error downloading Spriggit',
        extractError
      );
    });

    it('should handle chmod errors gracefully', async () => {
      const version = 'v1.2.3';
      const chmodError = new Error('Permission denied');

      mockDownloadFileToDestination.mockResolvedValue();
      mockUnzipFile.mockResolvedValue();
      mockFs.chmodSync.mockImplementation(() => {
        throw chmodError;
      });

      await downloadSpriggit(version);

      expect(mockDownloadFileToDestination).toHaveBeenCalled();
      expect(mockUnzipFile).toHaveBeenCalled();
      expect(mockFs.chmodSync).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        'There was an error downloading Spriggit',
        chmodError
      );
    });

    it('should construct the correct URL for different versions', async () => {
      const versions = ['v1.0.0', 'v2.5.10', 'v0.1.0-beta', 'latest'];

      mockDownloadFileToDestination.mockResolvedValue();
      mockUnzipFile.mockResolvedValue();
      mockFs.chmodSync.mockImplementation();

      for (const version of versions) {
        await downloadSpriggit(version);
        const expectedUrl = `https://github.com/Mutagen-Modding/Spriggit/releases/download/${version}/SpriggitLinuxCLI.zip`;
        expect(mockDownloadFileToDestination).toHaveBeenCalledWith(
          expectedUrl,
          'SpriggitLinuxCLI.zip'
        );
      }

      expect(mockDownloadFileToDestination).toHaveBeenCalledTimes(
        versions.length
      );
    });

    it('should use the correct file paths', async () => {
      const version = 'v1.0.0';

      mockDownloadFileToDestination.mockResolvedValue();
      mockUnzipFile.mockResolvedValue();
      mockFs.chmodSync.mockImplementation();

      await downloadSpriggit(version);

      expect(mockDownloadFileToDestination).toHaveBeenCalledWith(
        expect.any(String),
        'SpriggitLinuxCLI.zip'
      );
      expect(mockUnzipFile).toHaveBeenCalledWith(
        'SpriggitLinuxCLI.zip',
        'spriggit'
      );
      expect(mockFs.chmodSync).toHaveBeenCalledWith(
        'spriggit/Spriggit.CLI',
        '755'
      );
    });

    it('should log progress messages in the correct order', async () => {
      const version = 'v1.0.0';
      const logSpy = jest.spyOn(console, 'log');

      mockDownloadFileToDestination.mockResolvedValue();
      mockUnzipFile.mockResolvedValue();
      mockFs.chmodSync.mockImplementation();

      await downloadSpriggit(version);

      const logCalls = logSpy.mock.calls.map(call => call[0]);

      expect(logCalls).toEqual([
        'Downloading Spriggit v1.0.0 to SpriggitLinuxCLI.zip',
        'Successfully downloaded Spriggit v1.0.0',
        'Extracting spriggit to spriggit',
        'Spriggit extracted successfully',
        'Giving +x permission to spriggit/Spriggit.CLI',
      ]);
    });

    it('should handle empty version string', async () => {
      const version = '';
      const expectedUrl =
        'https://github.com/Mutagen-Modding/Spriggit/releases/download//SpriggitLinuxCLI.zip';

      mockDownloadFileToDestination.mockResolvedValue();
      mockUnzipFile.mockResolvedValue();
      mockFs.chmodSync.mockImplementation();

      await downloadSpriggit(version);

      expect(mockDownloadFileToDestination).toHaveBeenCalledWith(
        expectedUrl,
        'SpriggitLinuxCLI.zip'
      );
    });
  });
});
