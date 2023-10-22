import {
  FetchChangeLogsMigration,
  FetchReleaseNotesMigration,
} from './fetch-release-notes-migration';

describe('config/migrations/custom/fetch-release-notes-migration', () => {
  it('migrates', () => {
    expect(FetchReleaseNotesMigration).toMigrate(
      {
        fetchReleaseNotes: false as never,
      },
      {
        fetchReleaseNotes: 'off',
      }
    );
    expect(FetchReleaseNotesMigration).toMigrate(
      {
        fetchReleaseNotes: true as never,
      },
      {
        fetchReleaseNotes: 'pr',
      }
    );
  });

  it('migrates change logs', () => {
    expect(FetchChangeLogsMigration).toMigrate(
      {
        fetchChangeLogs: false as never,
      },
      {
        fetchChangeLogs: 'off',
      }
    );
    expect(FetchChangeLogsMigration).toMigrate(
      {
        fetchChangeLogs: true as never,
      },
      {
        fetchChangeLogs: 'pr',
      }
    );
  });
});
