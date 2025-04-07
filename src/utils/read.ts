import { readFileSync } from 'fs';
import { join } from 'path';

function read(file: string): any {
  const templates = join(process.cwd(), 'src/templates');
  const partials = join(templates, 'partials');
  return readFileSync(join(partials, file), 'utf8');
}

export { read };
