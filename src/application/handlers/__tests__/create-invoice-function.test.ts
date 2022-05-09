import { CURRENCY, lambdaHandler } from '../create-invoice-function'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import isBase64 from 'is-base64'

const data = {
  images: {
    background: 'https://public.easyinvoice.cloud/pdf/sample-background.pdf',
  },
  sender: {
    company: 'Sample Corp',
    address: 'Sample Street 123',
    zip: '1234 AB',
    city: 'Sampletown',
    country: 'Samplecountry',
  },
  client: {
    company: 'Client Corp',
    address: 'Clientstreet 456',
    zip: '4567 CD',
    city: 'Clientcity',
    country: 'Clientcountry',
  },
  information: {
    number: '2022.0001',
    date: '1.1.2022',
    'due-date': '15.1.2022',
  },
  products: [
    {
      quantity: 2,
      description: 'Test1',
      'tax-rate': 6,
      price: 33.87,
    },
    {
      quantity: 4,
      description: 'Test2',
      'tax-rate': 21,
      price: 10.45,
    },
  ],
  'bottom-notice': 'Kindly pay your invoice within 15 days.',
  settings: {
    currency: CURRENCY.USD,
    'tax-notation': 'vat',
    'margin-top': 50,
    'margin-right': 50,
    'margin-left': 50,
    'margin-bottom': 25,
  },
}

const mockS3Instance = {
  upload: jest.fn().mockReturnThis(),
  promise: jest.fn().mockResolvedValue({
    Location: '',
  }),
  catch: jest.fn(),
}

jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => mockS3Instance),
  config: { update: jest.fn().mockReturnThis() },
}))

jest.mock('data-api-client', () => {
  const promise = {
    query: jest
      .fn()
      .mockResolvedValueOnce({
        records: [
          {
            name: 'danile baker',
            age: 24,
            email: 'fakeemail@fakeemail.com',
            role: 'admin',
          },
        ],
      })
      .mockResolvedValueOnce({
        records: [],
      }),
  }

  return jest.fn(() => promise)
})

describe('create-invoice-function', () => {
  beforeEach(async () => {
    process.env.JWT_SECRET = 'somesecretpossiblyssl'
    process.env.JWT_EXPIRES_IN = '30d'
    process.env.INVOICE_STORAGE_BUCKET_NAME = 'INVOICE_STORAGE_BUCKET_NAME'
  })

  afterEach(() => jest.clearAllMocks())

  describe('Happy path :)', () => {
    it('should return base64 pdf files', async () => {
      const response: APIGatewayProxyResult = await lambdaHandler({
        body: JSON.stringify([data]),
      } as APIGatewayProxyEvent)

      // https://www.youtube.com/watch?v=yqJwN8EBCw8
      const { files } = JSON.parse(response.body) as { files: string[] }
      expect(files.every((file) => isBase64(file))).toEqual(true)
    })
  })
})
