import AWS from 'aws-sdk';
import logger from '../../../services/logging';
import BucketAdapter, { FilesFormat } from './BucketAdapter';

export default interface IBucketAdapter {
  upload(data: string, fileName: string, extension: FilesFormat): Promise<string>;
  getObjectsByPrefixAndContentType(prefix: string, extension: FilesFormat): Promise<string[]>;
}

export function createInvoiceStorageBucketAdapter(): BucketAdapter {
  logger.info('createInvoiceStorageBucketAdapter')
  AWS.config.update({ region: 'eu-west-1' });

  return new BucketAdapter(
    new AWS.S3({ apiVersion: '2006-03-01' }),
    String(process.env.INVOICE_STORAGE_BUCKET_NAME),
  );
}
