import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AIServiceFactory } from '@/services/aiService';

describe('AIServiceFactory', () => {
  beforeEach(() => {
    // Reset singleton instance before each test
    AIServiceFactory.resetInstance();
    
    // Reset environment variables
    delete process.env.AI_PROVIDER;
    delete process.env.USE_MOCK_AI;
    delete process.env.CLAUDE_API_KEY;
  });

  afterEach(() => {
    AIServiceFactory.resetInstance();
  });

  describe('getInstance', () => {
    it('should return mock service when USE_MOCK_AI is true', async () => {
      process.env.USE_MOCK_AI = 'true';
      
      const service = await AIServiceFactory.getInstance();
      
      expect(service.getProviderName()).toBe('Claude (Mock)');
    });

    it('should return mock service when CLAUDE_API_KEY is placeholder', async () => {
      process.env.CLAUDE_API_KEY = 'sk-ant-api03-tu_clave_aqui';
      
      const service = await AIServiceFactory.getInstance();
      
      expect(service.getProviderName()).toBe('Claude (Mock)');
    });

    it('should return mock service when CLAUDE_API_KEY is missing', async () => {
      delete process.env.CLAUDE_API_KEY;
      
      const service = await AIServiceFactory.getInstance();
      
      expect(service.getProviderName()).toBe('Claude (Mock)');
    });

    it('should return the same instance on multiple calls (singleton)', async () => {
      process.env.USE_MOCK_AI = 'true';
      
      const service1 = await AIServiceFactory.getInstance();
      const service2 = await AIServiceFactory.getInstance();
      
      expect(service1).toBe(service2);
    });

    it('should throw error for unknown AI provider', async () => {
      process.env.AI_PROVIDER = 'unknown_provider';
      
      await expect(AIServiceFactory.getInstance()).rejects.toThrow('Unknown AI provider: unknown_provider');
    });

    it('should throw error for unimplemented OpenAI provider', async () => {
      process.env.AI_PROVIDER = 'openai';
      
      await expect(AIServiceFactory.getInstance()).rejects.toThrow('OpenAI service not implemented yet');
    });

    it('should default to claude provider when AI_PROVIDER is not set', async () => {
      process.env.USE_MOCK_AI = 'true';
      delete process.env.AI_PROVIDER;
      
      const service = await AIServiceFactory.getInstance();
      
      expect(service.getProviderName()).toBe('Claude (Mock)');
    });
  });

  describe('resetInstance', () => {
    it('should reset singleton instance', async () => {
      process.env.USE_MOCK_AI = 'true';
      
      const service1 = await AIServiceFactory.getInstance();
      AIServiceFactory.resetInstance();
      const service2 = await AIServiceFactory.getInstance();
      
      // Should be different instances after reset
      expect(service1).not.toBe(service2);
      // But same provider name
      expect(service1.getProviderName()).toBe(service2.getProviderName());
    });
  });
});