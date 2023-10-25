import type { BranchUpgradeConfig } from '../../../../../types';
import { ChangeLogSource } from '../source';

export class AzureChangeLogSource extends ChangeLogSource {
  constructor() {
    super('azure', 'git-tags');
  }

  override getCompareURL(
    baseUrl: string,
    repository: string,
    prevHead: string,
    nextHead: string
  ): string {
    throw new Error('Method not implemented.');
  }
  override getAPIBaseUrl(config: BranchUpgradeConfig): string {
    throw new Error('Method not implemented.');
  }
}
