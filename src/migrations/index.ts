import * as migration_20260916_091702_baseline from './20260916_091702_baseline';

export const migrations = [
  {
    up: migration_20260916_091702_baseline.up,
    down: migration_20260916_091702_baseline.down,
    name: '20260916_091702_baseline'
  },
];
