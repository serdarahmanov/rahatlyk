import * as migration_20260616_131401 from './20260616_131401';
import * as migration_20260616_132009 from './20260616_132009';
import * as migration_20260616_143311 from './20260616_143311';
import * as migration_20260616_152159 from './20260616_152159';

export const migrations = [
  {
    up: migration_20260616_131401.up,
    down: migration_20260616_131401.down,
    name: '20260616_131401',
  },
  {
    up: migration_20260616_132009.up,
    down: migration_20260616_132009.down,
    name: '20260616_132009',
  },
  {
    up: migration_20260616_143311.up,
    down: migration_20260616_143311.down,
    name: '20260616_143311',
  },
  {
    up: migration_20260616_152159.up,
    down: migration_20260616_152159.down,
    name: '20260616_152159'
  },
];
