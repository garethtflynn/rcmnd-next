import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { LoginButton, LogoutButton } from '../auth'
import { User } from '../../components/userTest'
import { useSession } from 'next-auth/react';


export default async function TestAuth() {
  const session = await getServerSession(authOptions)
  // const { data: session } = useSession();

  return (
    <div>
      <LoginButton />
      <LogoutButton />
      <h2>Server Session</h2>
      <div>{session ? `Logged in as ${session.user.email}` : "Not logged in"}</div>
      <h2>Client Call</h2>
      <User />
    </div>
  )
}