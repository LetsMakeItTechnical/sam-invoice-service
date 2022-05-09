import { InvoiceData } from 'easyinvoice'
import PrintInteractor from '.'
import { FilesFormat } from '../../../infrastructure/adapters/BucketAdapter/BucketAdapter'
import { createInvoiceStorageBucketAdapter } from '../../../infrastructure/adapters/BucketAdapter/IBucketAdapter'
import logger from '../../../services/logging'
import FilesInteractor from '../FileInteractor'

export interface IPrintResponse {
  files: string[]
  error?: string
}

export interface IPrintInteractor {
  printInvoices({
    refNo,
    format,
    vendorId,
    invoiceData,
  }: {
    refNo: string
    format: FilesFormat
    vendorId: string
    invoiceData: InvoiceData[]
  }): Promise<IPrintResponse>
}

export function createPrintInteractor(): PrintInteractor {
  logger.info('createPrintInteractor')
  const bucketAdapter = createInvoiceStorageBucketAdapter()
  logger.info('debug')

  return new PrintInteractor(new FilesInteractor(bucketAdapter))
}
