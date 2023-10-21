import changelogFilenameRegex from 'changelog-filename-regex';
import { logger } from '../../../../../../logger';
import { ReleasesSchema } from '../../../../../../modules/datasource/gitea-releases/schema';
import {
  ContentsListResponseSchema,
  type ContentsResponse,
  ContentsResponseSchema,
} from '../../../../../../modules/platform/gitea/schema';
import { GiteaHttp } from '../../../../../../util/http/gitea';
import { fromBase64 } from '../../../../../../util/string';
import type { BranchUpgradeConfig } from '../../../../../types';
import { ChangeLogSource } from '../source';
import type {
  ChangeLogFile,
  ChangeLogProject,
  ChangeLogRelease,
  ChangeLogNotes,
} from '../types';

export const id = 'gitea-changelog';
const http = new GiteaHttp(id);

export class GiteaChangeLogSource extends ChangeLogSource {
  constructor() {
    super('gitea', 'gitea-tags');
  }

  getAPIBaseUrl(config: BranchUpgradeConfig): string {
    return this.getBaseUrl(config) + 'api/v1/';
  }

  getCompareURL(
    baseUrl: string,
    repository: string,
    prevHead: string,
    nextHead: string
  ): string {
    return `${baseUrl}${repository}/compare/${prevHead}...${nextHead}`;
  }

  override hasValidRepository(repository: string): boolean {
    return repository.split('/').length === 2;
  }
  override async getReleaseNotesMd(
    repository: string,
    apiBaseUrl: string,
    sourceDirectory?: string
  ): Promise<ChangeLogFile | null> {
    logger.trace('gitea.getReleaseNotesMd()');
    const apiPrefix = `${apiBaseUrl}repos/${repository}/contents`;

    const sourceDir = sourceDirectory ? `/${sourceDirectory}` : '';
    const tree = (
      await http.getJson(
        `${apiPrefix}${sourceDir}`,
        {
          paginate: false, // no pagination yet
        },
        ContentsListResponseSchema
      )
    ).body;
    const allFiles = tree.filter((f) => f.type === 'file');
    let files: ContentsResponse[] = [];
    if (!files.length) {
      files = allFiles.filter((f) => changelogFilenameRegex.test(f.name));
    }
    if (!files.length) {
      logger.trace('no changelog file found');
      return null;
    }

    const { path: changelogFile } = files.shift()!;
    /* istanbul ignore if */
    if (files.length !== 0) {
      logger.debug(
        `Multiple candidates for changelog file, using ${changelogFile}`
      );
    }

    const fileRes = await http.getJson(
      `${apiPrefix}/${changelogFile}`,
      ContentsResponseSchema
    );
    // istanbul ignore if: should never happen
    if (!fileRes.body.content) {
      logger.debug(
        `Missing content for changelog file, using ${changelogFile}`
      );
      return null;
    }
    const changelogMd = fromBase64(fileRes.body.content) + '\n#\n##';

    return { changelogFile, changelogMd };
  }

  override async getReleaseList(
    project: ChangeLogProject,
    _release: ChangeLogRelease
  ): Promise<ChangeLogNotes[]> {
    logger.trace('gitea.getReleaseNotesMd()');
    const apiUrl = `${project.apiBaseUrl}repos/${project.repository}/releases`;

    const res = await http.getJson(
      `${apiUrl}?draft=false`,
      {
        paginate: true,
      },
      ReleasesSchema
    );
    return res.body.map((release) => ({
      url: `${project.baseUrl}${project.repository}/releases/tag/${release.tag_name}`,
      notesSourceUrl: apiUrl,
      name: release.name,
      body: release.body,
      tag: release.tag_name,
    }));
  }
}
