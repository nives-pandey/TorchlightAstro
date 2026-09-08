/**
 * Torchlight — account deletion tests
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Deletion is one statement against `users` and relies entirely on the cascade
 * chain, so what needs proving is the chain rather than the statement.
 *
 * A row that fails to cascade is not untidiness: a person who asks to be
 * forgotten and whose chart stays behind has not been forgotten, and Google
 * Play treats that as a policy breach rather than a bug.
 *
 * The migrations are the authority here — they are what actually ran against
 * the database, whereas the schema file is only what we believe it did.
 */
describe('account deletion', () => {
  const migrations = join(__dirname, '..', '..', 'drizzle');

  const sql = readdirSync(migrations)
    .filter((name) => name.endsWith('.sql'))
    .map((name) => readFileSync(join(migrations, name), 'utf8'))
    .join('\n');

  /** Every table holding data that belongs to one person. */
  const personal = ['birth_profiles', 'charts', 'readings', 'refresh_tokens'];

  it.each(personal)('cascades deletes into %s', (table) => {
    // The constraint may be declared inline or added later; both forms name the
    // table and end in ON DELETE cascade.
    const constraint = new RegExp(
      `"${table}"[\\s\\S]{0,400}?ON DELETE cascade`,
      'i',
    );

    expect(sql).toMatch(constraint);
  });

  it('leaves no table referencing a user without cascading', () => {
    // Any foreign key that is explicitly restricted would strand rows behind a
    // deleted account.
    expect(sql).not.toMatch(/ON DELETE (no action|restrict)/i);
  });
});
