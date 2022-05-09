import dataApiClient from 'data-api-client'

const db = dataApiClient({
  secretArn: process.env.SECRET_ARN!,
  resourceArn: process.env.PGDBCLUSTERARN!,
  database: process.env.PGDATABASE,
})

export default db
