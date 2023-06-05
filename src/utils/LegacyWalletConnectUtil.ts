import { IWalletConnectSession } from '@walletconnect/legacy-types'
import LegacySignClient from '@walletconnect/client'
import ModalStore from '../store/ModalStore'
import { EIP155_SIGNING_METHODS } from '../data/EIP155Data'

export let legacySignClient: LegacySignClient

export function createLegacySignClient({ uri }: { uri?: string } = {}) {
  // If URI is passed always create a new session,
  // otherwise fall back to cached session if client isn't already instantiated.
  if (uri) {
    console.log('legacySignClient > create new session')
    deleteCachedLegacySession()
    legacySignClient = new LegacySignClient({ uri })
  } else if (!legacySignClient && getCachedLegacySession()) {
    console.log('legacySignClient > create from cached session')
    const session = getCachedLegacySession()
    legacySignClient = new LegacySignClient({ session })
  } else {
    console.log('legacySignClient already instantiated')
    return
  }

  legacySignClient.on('session_request', (error, payload) => {
    console.log('legacySignClient > session_request')
    if (error) {
      console.error(error)
      throw new Error(`legacySignClient > session_request failed: ${error}`)
    }

    console.log('legacySignClient > session_request > payload', payload)
    ModalStore.open('LegacySessionProposalModal', { legacyProposal: payload })
  })

  legacySignClient.on('connect', () => {
    console.log('legacySignClient > connect')
  })

  legacySignClient.on('error', error => {
    console.error(error)
    throw new Error(`legacySignClient > on error: ${error}`)
  })

  legacySignClient.on('call_request', (error, payload) => {
    console.log('legacySignClient > call_request')
    if (error) {
      console.error(error)
      throw new Error(`legacySignClient > call_request failed: ${error}`)
    }
    onCallRequest(payload)
  })

  legacySignClient.on('disconnect', async () => {
    console.log('legacySignClient > disconnect')
    deleteCachedLegacySession()
  })
}

const onCallRequest = async (payload: { id: number; method: string; params: any[] }) => {
  console.log('legacySignClient > onCallRequest', payload)
  for (const param of payload.params) {
    console.log('legacySignClient > onCallRequest > payload.param loop', param)
  }
  switch (payload.method) {
    case EIP155_SIGNING_METHODS.ETH_SIGN:
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      console.log('legacySignClient > onCallRequest > ETH_SIGN || PERSONAL_SIGN')
      return ModalStore.open('LegacySessionSignModal', {
        legacyCallRequestEvent: payload,
        legacyRequestSession: legacySignClient.session
      })

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      console.log('legacySignClient > onCallRequest > ETH_SIGN_TYPED_DATA || ETH_SIGN_TYPED_DATA_V3 || ETH_SIGN_TYPED_DATA_V4')
      return ModalStore.open('LegacySessionSignTypedDataModal', {
        legacyCallRequestEvent: payload,
        legacyRequestSession: legacySignClient.session
      })

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      console.log('legacySignClient > onCallRequest > ETH_SEND_TRANSACTION || ETH_SIGN_TRANSACTION')
      return ModalStore.open('LegacySessionSendTransactionModal', {
        legacyCallRequestEvent: payload,
        legacyRequestSession: legacySignClient.session
      })

    default:
      console.error('legacySignClient > onCallRequest > default')
      alert(`${payload.method} is not supported for WalletConnect v1`)
  }
}

function getCachedLegacySession(): IWalletConnectSession | undefined {
  if (typeof window === 'undefined') return

  const local = window.localStorage ? window.localStorage.getItem('walletconnect') : null

  let session = null
  if (local) {
    try {
      session = JSON.parse(local)
    } catch (error) {
      throw error
    }
  }
  return session
}

function deleteCachedLegacySession(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem('walletconnect')
}
