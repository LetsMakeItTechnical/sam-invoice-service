import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { AppError } from '../../utils/appError'
import { HTTP_STATUS_CODE } from '../../utils/HttpClient/http-status-codes'
import { redactCustomerDetails } from '../../utils/RedactCustomerDetails'
import logger from '../services/logging'
import { InvoiceData } from 'easyinvoice'
import { createPrintInteractor } from '../domain/interactor/PrintInteractor'
import { FilesFormat } from '../infrastructure/adapters/BucketAdapter/BucketAdapter'

export enum CURRENCY {
  USD = 'USD',
  GBP = 'GBP',
}

export const lambdaHandler = async function (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  if (!event.body) throw new Error('Invalid request payload');

  const createInvoiceParsedBody = (JSON.parse(event.body) ||
    {}) as InvoiceData[]

  logger.info('invoice request', {
    request: redactCustomerDetails(createInvoiceParsedBody),
  })

  try {
    const printInteractor = createPrintInteractor()
    const { files } = await printInteractor.printInvoices({
      refNo: '',
      format: FilesFormat.PDF,
      vendorId: '12',
      invoiceData: createInvoiceParsedBody,
    })
    return {
      statusCode: HTTP_STATUS_CODE.CREATED,
      body: JSON.stringify({
        files,
      }),
    }
  } catch (err) {
    const error = err as AppError
    logger.error('register', error)
    error.statusCode =
      error.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    error.status = error.status || 'error'

    if (error?.isOperational) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          status: error.status,
          message: error.message,
        }),
      }
    }

    return {
      statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        status: 'error',
        message: 'Something went very wrong!',
      }),
    }
  }
}
