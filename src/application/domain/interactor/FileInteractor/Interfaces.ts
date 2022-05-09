import { FilesFormat } from '../../../infrastructure/adapters/BucketAdapter/BucketAdapter';

export interface FileOrderLine {
  referenceNo: string;
  currentStatus: string;
  format: FilesFormat;
}

export interface IIFilesInteractor {
  uploadFiles({
    files, format, refNo, vendorId,
  }: {
    files: string[];
    format: FilesFormat;
    refNo: string;
    vendorId: string;
  }): Promise<string[]>;
  fetchFiles(companyId: number, FileOrderLine: FileOrderLine): Promise<string[]>;
}


