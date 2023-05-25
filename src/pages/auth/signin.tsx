import {Button, Center, Stack} from '@mantine/core'
import {type GetServerSidePropsContext, type NextPage} from 'next'
import {getProviders, signIn} from 'next-auth/react'
import {type AppProps} from 'next/app'
import {getServerAuthSession} from '~/server/auth'

type SignInProps = {
  providers: AppProps
}

const SignInPage: NextPage<SignInProps> = ({providers}) => {
  const handleSignIn = async (provider: string) => {
    await signIn(provider, {callbackUrl: window.location.origin})
  }

  return (
    <Center m={4}>
      <Stack pt="xl" spacing="xs">
        {Object.keys(providers).map((provider, index) => (
          <Button
            key={index}
            m={4}
            onClick={() => handleSignIn(provider)}
            tt="capitalize"
          >
            Sign In with {provider}
          </Button>
        ))}
      </Stack>
    </Center>
  )
}

export default SignInPage

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx)

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const providers = await getProviders()
  return {
    props: {
      providers,
    },
  }
}
