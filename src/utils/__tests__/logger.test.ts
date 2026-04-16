import { describe, it, expect, vi } from 'vitest';
import { logger } from '../logger';

describe('Logger', () => {
  it('should log debug messages', () => {
    const consoleSpy = vi.spyOn(console, 'debug');
    logger.debug('Test debug message', { userId: 'test-123' });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log info messages', () => {
    const consoleSpy = vi.spyOn(console, 'info');
    logger.info('Test info message', { action: 'test' });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log error messages with context', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    const error = new Error('Test error');
    logger.error('Test error message', error, { component: 'TestComponent' });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should format log entries correctly', () => {
    const consoleSpy = vi.spyOn(console, 'info');
    logger.info('Test message', { userId: 'user-123', action: 'test-action' });
    const call = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1][0];
    expect(call).toContain('[INFO]');
    expect(call).toContain('user-123');
  });
});
