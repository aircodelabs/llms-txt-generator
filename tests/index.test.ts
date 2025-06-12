/**
 * Entry file tests
 */

import { helloWorld } from '../src/index';

describe('Index Module', () => {
  describe('helloWorld', () => {
    it('should return the correct greeting message', () => {
      const result = helloWorld();
      expect(result).toBe('Hello World from LLMs TXT Generator!');
    });

    it('should return a string', () => {
      const result = helloWorld();
      expect(typeof result).toBe('string');
    });
  });
});