import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { configureApp } from './configure-app';

describe('configureApp', () => {
  it('applies the shared Nest bootstrap defaults', () => {
    const getOrThrow = vi.fn((key: string) => {
      if (key === 'CORS_ORIGIN') {
        return 'http://localhost:5173';
      }

      throw new Error(`Unexpected key: ${key}`);
    });

    const app = {
      get: vi.fn().mockImplementation((token: unknown) => {
        expect(token).toBe(ConfigService);
        return { getOrThrow };
      }),
      setGlobalPrefix: vi.fn(),
      useGlobalPipes: vi.fn(),
      enableCors: vi.fn(),
    };

    configureApp(app as never);

    expect(app.setGlobalPrefix).toHaveBeenCalledWith('api');
    expect(app.useGlobalPipes).toHaveBeenCalledTimes(1);
    expect(app.useGlobalPipes.mock.calls[0]?.[0]).toBeInstanceOf(
      ValidationPipe,
    );
    expect(app.enableCors).toHaveBeenCalledWith({
      origin: ['http://localhost:5173'],
    });
  });
});
