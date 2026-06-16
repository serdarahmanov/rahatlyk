import * as migration_20260616_131401 from './20260616_131401';
import * as migration_20260616_132009 from './20260616_132009';

export const migrations = [
  {
    up: migration_20260616_131401.up,
    down: migration_20260616_131401.down,
    name: '20260616_131401',
  },
  {
    up: migration_20260616_132009.up,
    down: migration_20260616_132009.down,
    name: '20260616_132009'
  },
];
