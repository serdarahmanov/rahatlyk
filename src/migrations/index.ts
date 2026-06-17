import * as migration_20260616_131401 from './20260616_131401';
import * as migration_20260616_132009 from './20260616_132009';
import * as migration_20260616_143311 from './20260616_143311';
import * as migration_20260616_152159 from './20260616_152159';
import * as migration_20260617_080330 from './20260617_080330';
import * as migration_20260617_082735 from './20260617_082735';
import * as migration_20260617_083800 from './20260617_083800';
import * as migration_20260617_110632 from './20260617_110632';
import * as migration_20260617_131819 from './20260617_131819';
import * as migration_20260617_132026 from './20260617_132026';

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
    name: '20260616_152159',
  },
  {
    up: migration_20260617_080330.up,
    down: migration_20260617_080330.down,
    name: '20260617_080330',
  },
  {
    up: migration_20260617_082735.up,
    down: migration_20260617_082735.down,
    name: '20260617_082735',
  },
  {
    up: migration_20260617_083800.up,
    down: migration_20260617_083800.down,
    name: '20260617_083800',
  },
  {
    up: migration_20260617_110632.up,
    down: migration_20260617_110632.down,
    name: '20260617_110632',
  },
  {
    up: migration_20260617_131819.up,
    down: migration_20260617_131819.down,
    name: '20260617_131819',
  },
  {
    up: migration_20260617_132026.up,
    down: migration_20260617_132026.down,
    name: '20260617_132026'
  },
];
