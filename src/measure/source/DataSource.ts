import {MeasureSpec} from '../MeasureSpec';
import { SourceDependency } from './SourceDependency';

export abstract class DataSource {
  static readonly STORAGE_PREFIX = "@source_service:"

  abstract readonly name: string;
  abstract readonly description: string;

  private supportCheckResult: {
    supported: boolean;
    reason?: UnSupportedReason;
  } = null;

  async checkSupportedInSystem(): Promise<{
    supported: boolean;
    reason?: UnSupportedReason;
  }> {
    if (this.supportCheckResult) {
      return Promise.resolve(this.supportCheckResult);
    } else {
      this.supportCheckResult = await this.onCheckSupportedInSystem();
      return this.supportCheckResult;
    }
  }

  protected abstract onCheckSupportedInSystem(): Promise<{
    supported: boolean;
    reason?: UnSupportedReason;
  }>;

  abstract readonly supportedMeasures: ReadonlyArray<DataSourceMeasure>;

  getMeasureOfType(typeKey: string): DataSourceMeasure {
    return this.supportedMeasures.find(m => m.spec.type == typeKey);
  }

  getMeasureOfSpec(spec: MeasureSpec): DataSourceMeasure {
    return this.supportedMeasures.find(m => m.spec.nameKey === spec.nameKey);
  }
}

export abstract class DataSourceMeasure {
  abstract readonly spec: MeasureSpec;

  get code(): string{ return this.source.name + ":" + this.spec.nameKey}

  protected castedSource<T extends DataSource>(): T {
    return this.source as T;
  }

  constructor(readonly source: DataSource) {}

  abstract readonly dependencies: ReadonlyArray<SourceDependency>
}

export enum UnSupportedReason {
  OS,
  Credential,
}
