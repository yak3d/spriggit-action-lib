import { unzipFile } from '../src/zip/unzip';

// Mock the decompress module
jest.mock('decompress');

describe('unzip', () => {
  const mockDecompress = require('decompress') as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('unzipFile', () => {
    it('should successfully extract a zip file', async () => {
      const filePath = '/path/to/archive.zip';
      const destination = '/path/to/extract';

      mockDecompress.mockResolvedValue([]);

      await unzipFile(filePath, destination);

      expect(mockDecompress).toHaveBeenCalledWith(filePath, destination);
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should handle decompress errors and log them', async () => {
      const filePath = '/path/to/invalid.zip';
      const destination = '/path/to/extract';
      const error = new Error('Failed to extract zip');

      mockDecompress.mockRejectedValue(error);

      await expect(unzipFile(filePath, destination)).rejects.toThrow(error);

      expect(mockDecompress).toHaveBeenCalledWith(filePath, destination);
      expect(console.error).toHaveBeenCalledWith(
        `There was an error extracting the zip at ${filePath}`,
        error
      );
    });

    it('should handle file not found errors', async () => {
      const filePath = '/nonexistent/file.zip';
      const destination = '/path/to/extract';
      const error = new Error('ENOENT: no such file or directory');

      mockDecompress.mockRejectedValue(error);

      await expect(unzipFile(filePath, destination)).rejects.toThrow(error);

      expect(mockDecompress).toHaveBeenCalledWith(filePath, destination);
      expect(console.error).toHaveBeenCalledWith(
        `There was an error extracting the zip at ${filePath}`,
        error
      );
    });

    it('should handle permission errors', async () => {
      const filePath = '/path/to/archive.zip';
      const destination = '/restricted/path';
      const error = new Error('EACCES: permission denied');

      mockDecompress.mockRejectedValue(error);

      await expect(unzipFile(filePath, destination)).rejects.toThrow(error);

      expect(mockDecompress).toHaveBeenCalledWith(filePath, destination);
      expect(console.error).toHaveBeenCalledWith(
        `There was an error extracting the zip at ${filePath}`,
        error
      );
    });

    it('should handle corrupted zip files', async () => {
      const filePath = '/path/to/corrupted.zip';
      const destination = '/path/to/extract';
      const error = new Error('Invalid or corrupted zip file');

      mockDecompress.mockRejectedValue(error);

      await expect(unzipFile(filePath, destination)).rejects.toThrow(error);

      expect(mockDecompress).toHaveBeenCalledWith(filePath, destination);
      expect(console.error).toHaveBeenCalledWith(
        `There was an error extracting the zip at ${filePath}`,
        error
      );
    });

    it('should pass through the exact error thrown by decompress', async () => {
      const filePath = '/path/to/test.zip';
      const destination = '/path/to/extract';
      const customError = new Error('Custom decompress error');
      customError.name = 'DecompressError';

      mockDecompress.mockRejectedValue(customError);

      await expect(unzipFile(filePath, destination)).rejects.toThrow(
        customError
      );
      await expect(unzipFile(filePath, destination)).rejects.toThrow(
        'Custom decompress error'
      );

      expect(mockDecompress).toHaveBeenCalledWith(filePath, destination);
    });
  });
});
