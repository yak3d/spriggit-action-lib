import * as fs from 'fs';
import * as path from 'path';
import { downloadFileToDestination } from '../src/http/http';

// Mock modules
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));
jest.mock('follow-redirects');

describe('http', () => {
  const mockFs = fs as jest.Mocked<typeof fs>;
  let mockRequest: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    (mockFs.existsSync as jest.Mock).mockReturnValue(true);
    (mockFs.mkdirSync as jest.Mock).mockImplementation();
    (mockFs.writeFileSync as jest.Mock).mockImplementation();

    const followRedirects = require('follow-redirects');
    mockRequest = followRedirects.https.request;

    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('downloadFileToDestination', () => {
    it('should successfully download and save a file', async () => {
      const url = 'https://example.com/file.txt';
      const destination = '/path/to/file.txt';
      const mockData = Buffer.from('test file content');

      const mockConnection = {
        on: jest.fn(),
      };

      const mockRequestObject = {
        end: jest.fn(),
        on: jest.fn(),
      };

      // Mock successful request
      mockRequest.mockImplementation((url, callback) => {
        callback(mockConnection);
        return mockRequestObject;
      });

      // Mock successful data events
      mockConnection.on.mockImplementation((event, handler) => {
        if (event === 'data') {
          handler(mockData);
        } else if (event === 'end') {
          handler();
        }
      });

      (mockFs.existsSync as jest.Mock).mockReturnValue(false);

      await downloadFileToDestination(url, destination);

      expect(mockRequest).toHaveBeenCalledWith(url, expect.any(Function));
      expect(mockFs.mkdirSync).toHaveBeenCalledWith(path.dirname(destination), {
        recursive: true,
      });
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(destination, mockData);
      expect(console.log).toHaveBeenCalledWith(
        `Downloading file at url ${url}`
      );
    });

    it('should handle connection errors', async () => {
      const url = 'https://example.com/file.txt';
      const destination = '/path/to/file.txt';
      const error = new Error('Connection failed');

      const mockConnection = {
        on: jest.fn(),
      };

      const mockRequestObject = {
        end: jest.fn(),
        on: jest.fn(),
      };

      mockRequest.mockImplementation((url, callback) => {
        callback(mockConnection);
        return mockRequestObject;
      });

      mockConnection.on.mockImplementation((event, handler) => {
        if (event === 'error') {
          handler(error);
        }
      });

      await downloadFileToDestination(url, destination);

      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        `Attempted to download a file at ${url} but the download failed: `,
        error
      );
    });

    it('should not create directory when it already exists', async () => {
      const url = 'https://example.com/file.txt';
      const destination = '/existing/path/to/file.txt';
      const mockData = Buffer.from('test content');

      const mockConnection = {
        on: jest.fn(),
      };

      const mockRequestObject = {
        end: jest.fn(),
        on: jest.fn(),
      };

      mockRequest.mockImplementation((url, callback) => {
        callback(mockConnection);
        return mockRequestObject;
      });

      mockConnection.on.mockImplementation((event, handler) => {
        if (event === 'data') {
          handler(mockData);
        } else if (event === 'end') {
          handler();
        }
      });

      (mockFs.existsSync as jest.Mock).mockReturnValue(true);

      await downloadFileToDestination(url, destination);

      expect(mockFs.mkdirSync).not.toHaveBeenCalled();
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(destination, mockData);
    });

    it('should handle request-level errors', async () => {
      const url = 'https://example.com/file.txt';
      const destination = '/path/to/file.txt';
      const error = new Error('Request failed');

      const mockRequestObject = {
        end: jest.fn(),
        on: jest.fn(),
      };

      mockRequest.mockImplementation((url, callback) => {
        return mockRequestObject;
      });

      mockRequestObject.on.mockImplementation((event, handler) => {
        if (event === 'error') {
          handler(error);
        }
      });

      await downloadFileToDestination(url, destination);

      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        `Attempted to download a file at ${url} but the download failed: `,
        error
      );
    });
  });
});
