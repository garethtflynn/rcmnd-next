import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { LoginButton, LogoutButton } from '../auth'
import { User } from '../../components/userTest'

export default async function TestAuth() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <LoginButton />
      <LogoutButton />
      <h2>Server Session</h2>
      <pre>{JSON.stringify(session)}</pre>
      <h2>Client Call</h2>
      <User />
    </div>
  )
}