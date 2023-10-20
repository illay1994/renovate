import { BitbucketReleaseNoteSource } from './bitbucket';
import { GiteaReleaseNoteSource } from './gitea';
import { GitHubReleaseNoteSource } from './github';
import { GitLabReleaseNoteSource } from './gitlab';
import type { ReleaseNoteSource } from './types';

const releaseNote = new Map<string, ReleaseNoteSource>();
export default releaseNote;

releaseNote.set('bitbucket', new BitbucketReleaseNoteSource());
releaseNote.set('gitea', new GiteaReleaseNoteSource());
releaseNote.set('github', new GitHubReleaseNoteSource());
releaseNote.set('gitlab', new GitLabReleaseNoteSource());
