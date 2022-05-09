import easyinvoice, { InvoiceData } from 'easyinvoice'
import { FilesFormat } from '../../../infrastructure/adapters/BucketAdapter/BucketAdapter'
import logger from '../../../services/logging'

import { IIFilesInteractor } from '../FileInteractor'
import { IPrintInteractor, IPrintResponse } from './Interfaces'

export default class PrintInteractor implements IPrintInteractor {
  private readonly FilesAdapter: IIFilesInteractor

  constructor(FilesAdapter: IIFilesInteractor) {
    this.FilesAdapter = FilesAdapter
  }

  private async createInvoice(invoicesData: InvoiceData[]) {
    try {
      const results = await Promise.all(
        invoicesData.map((invoiceData) =>
          easyinvoice.createInvoice(invoiceData)
        )
      )

      return results.map(({ pdf }) => pdf)
    } catch (error) {
      return null
    }
  }

  /**.
   * creates and prints an invoice
   * @async
   * @param invoiceData
   * @param refNo
   * @param format
   * @param vendorId
   * @returns Print order line response
   **/
  public async printInvoices({
    refNo,
    format,
    vendorId,
    invoiceData,
  }: {
    refNo: string
    format: FilesFormat
    vendorId: string
    invoiceData: InvoiceData[]
  }): Promise<IPrintResponse> {
    const files: string[] | null = await this.createInvoice(invoiceData)

    return files
      ? this.handleSuccessfulPrint({
          files,
          refNo,
          format,
          vendorId,
        })
      : this.handleUnsuccessfulPrint({
          error: {} as Error,
          files,
          refNo,
          format,
          vendorId,
        })
  }

  /**
   * Facilitates the state transitions of order lines on a successful print via a DB transaction
   *
   * Also does post-print actions of inserting into action log inserting the returned invoices into S3
   *
   * If any of the post-print actions fail this function will log and error but still return the invoice.
   **/
  private async handleSuccessfulPrint({
    files,
    refNo,
    vendorId,
    format,
  }: {
    files: string[]
    refNo: string
    format: FilesFormat
    vendorId: string
  }): Promise<IPrintResponse> {
    await this.FilesAdapter.uploadFiles({
      files,
      vendorId,
      format,
      refNo,
    })

    // store file names in DB
    return {
      files,
    }
  }

  /**
   * Handles the result of an unsuccessful print via a DB transaction
   *
   * Transitions the applicable order lines to PRINT ERROR and inserts the relevant data into the DB
   *
   * Also logs into action log the transition in status
   **/
  private async handleUnsuccessfulPrint({
    error,
    files,
    refNo,
    vendorId,
    format,
  }: {
    error: Error
    files: string[] | null
    refNo: string
    format: FilesFormat
    vendorId: string
  }): Promise<IPrintResponse> {
    logger.info({
      error,
      files,
      refNo,
      vendorId,
      format,
    })
    return {} as IPrintResponse
  }
}
