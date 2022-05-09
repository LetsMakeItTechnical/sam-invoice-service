import db from './postgres-connection'

export async function getUserById(id: string) {
  const resultParams = await db.query<{ password: string }>(
    `SELECT * FROM user WHERE id = :id`,
    { id }
  )

  return resultParams.records[0]
}

export async function getUserByEmail(email: string) {
  const resultParams = await db.query<{ password: string }>(
    `SELECT * FROM user8 WHERE email = :email`,
    { email }
  )

  return resultParams.records[0]
}
   