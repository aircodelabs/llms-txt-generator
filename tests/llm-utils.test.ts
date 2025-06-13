/**
 * LLM Utils tests
 */

import { promises as fs } from 'node:fs';

describe('LLM Utils', () => {
  describe('Unit tests with mocked file system', () => {
    let mockFs: jest.Mocked<typeof fs>;
    let loadPrompt: any;
    let promptExists: any;
    let listPrompts: any;

    beforeAll(() => {
      // Mock the fs module
      jest.mock('node:fs', () => ({
        promises: {
          readFile: jest.fn(),
          access: jest.fn(),
          readdir: jest.fn(),
        },
      }));
      
      mockFs = require('node:fs').promises as jest.Mocked<typeof fs>;
      
      // Import the functions after mocking
      const utils = require('../src/llm/utils');
      loadPrompt = utils.loadPrompt;
      promptExists = utils.promptExists;
      listPrompts = utils.listPrompts;
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.unmock('node:fs');
    });

    describe('loadPrompt', () => {
      it('should load prompt content successfully', async () => {
        const mockContent = '# Test Prompt\n\nThis is a test prompt content.';
        mockFs.readFile.mockResolvedValue(mockContent);

      const result = await loadPrompt('test');

      expect(result).toBe(mockContent);
      expect(mockFs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('prompts/test.md'),
        'utf-8'
      );
    });

    it('should throw error when prompt file does not exist', async () => {
      const mockError = new Error('ENOENT: no such file or directory');
      mockFs.readFile.mockRejectedValue(mockError);

      await expect(loadPrompt('nonexistent')).rejects.toThrow(
        "Failed to load prompt 'nonexistent': ENOENT: no such file or directory"
      );
    });

    it('should handle unknown errors', async () => {
      mockFs.readFile.mockRejectedValue('Unknown error');

      await expect(loadPrompt('test')).rejects.toThrow(
        "Failed to load prompt 'test': Unknown error"
      );
    });
  });

  describe('promptExists', () => {
    it('should return true when prompt file exists', async () => {
      mockFs.access.mockResolvedValue(undefined);

      const result = await promptExists('existing');

      expect(result).toBe(true);
      expect(mockFs.access).toHaveBeenCalledWith(
        expect.stringContaining('prompts/existing.md')
      );
    });

    it('should return false when prompt file does not exist', async () => {
      mockFs.access.mockRejectedValue(new Error('ENOENT'));

      const result = await promptExists('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('listPrompts', () => {
    it('should list all markdown prompt files', async () => {
      const mockFiles = ['generate.md', 'test.md', 'example.txt', 'another.md'];
      mockFs.readdir.mockResolvedValue(mockFiles as any);

      const result = await listPrompts();

      expect(result).toEqual(['generate', 'test', 'another']);
      expect(mockFs.readdir).toHaveBeenCalledWith(
        expect.stringContaining('prompts')
      );
    });

    it('should return empty array when no markdown files exist', async () => {
      const mockFiles = ['readme.txt', 'config.json'];
      mockFs.readdir.mockResolvedValue(mockFiles as any);

      const result = await listPrompts();

      expect(result).toEqual([]);
    });

    it('should throw error when directory cannot be read', async () => {
      const mockError = new Error('Permission denied');
      mockFs.readdir.mockRejectedValue(mockError);

      await expect(listPrompts()).rejects.toThrow(
        'Failed to list prompts: Permission denied'
      );
    });

    it('should handle unknown errors', async () => {
      mockFs.readdir.mockRejectedValue('Unknown error');

      await expect(listPrompts()).rejects.toThrow(
        'Failed to list prompts: Unknown error'
      );
    });
    });
  });

  describe('Integration tests with real file system', () => {
    let loadPrompt: any;
    let promptExists: any;
    let listPrompts: any;

    beforeAll(() => {
      // Clear all mocks and import real modules
      jest.resetModules();
      jest.unmock('node:fs');
      
      // Import the real functions
      const utils = require('../src/llm/utils');
      loadPrompt = utils.loadPrompt;
      promptExists = utils.promptExists;
      listPrompts = utils.listPrompts;
    });

    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should load the actual generate.md prompt', async () => {
      const result = await loadPrompt('generate');
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('llms.txt');
    });

    it('should confirm generate prompt exists', async () => {
      const result = await promptExists('generate');
      
      expect(result).toBe(true);
    });

    it('should list prompts including generate', async () => {
      const result = await listPrompts();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('generate');
    });

    it('should return false for non-existent prompt', async () => {
      const result = await promptExists('definitely-does-not-exist');
      
      expect(result).toBe(false);
    });
  });
});