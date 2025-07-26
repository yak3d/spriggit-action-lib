import { downloadFileToDestination, unzipFile, downloadSpriggit } from '../src';

describe('index', () => {
  describe('exports', () => {
    it('should export downloadFileToDestination function', () => {
      expect(typeof downloadFileToDestination).toBe('function');
    });

    it('should export unzipFile function', () => {
      expect(typeof unzipFile).toBe('function');
    });

    it('should export downloadSpriggit function', () => {
      expect(typeof downloadSpriggit).toBe('function');
    });
  });
});
