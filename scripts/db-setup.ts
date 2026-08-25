import { ensureSetup } from '../lib/setup';

ensureSetup()
  .then(() => {
    console.log('✓ Setup completo.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('✗ Setup falló:', err);
    process.exit(1);
  });