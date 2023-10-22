import is from '@sindresorhus/is';
import { AbstractMigration } from '../base/abstract-migration';

export class FetchReleaseNotesMigration extends AbstractMigration {
  override readonly deprecated = true;
  override readonly propertyName = 'fetchReleaseNotes';

  override run(value: unknown): void {
    if (is.boolean(value)) {
      this.rewrite(value ? 'pr' : 'off');
    }
  }
}

// Second migration in case if old version and property already renamed
export class FetchChangeLogsMigration extends AbstractMigration {
  override readonly propertyName = 'fetchChangeLogs';

  override run(value: unknown): void {
    if (is.boolean(value)) {
      this.rewrite(value ? 'pr' : 'off');
    }
  }
}
