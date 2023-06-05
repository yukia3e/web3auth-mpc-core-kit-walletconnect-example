import { SafeEventEmitterProvider } from '@web3auth/base'
import { Web3AuthMPCCoreKit } from "@web3auth/mpc-core-kit"

import EIP155Lib from '../lib/EIP155Lib'

export let signer: EIP155Lib
export let eip155Wallets: Record<string, EIP155Lib>
export let eip155Addresses: string[]

let address: string

/**
 * Utilities
 */
export async function createOrRestoreEIP155Wallet(coreKitInstance: Web3AuthMPCCoreKit | null, provider: SafeEventEmitterProvider | null) {
  console.log('createOrRestoreEIP155Wallet > coreKitInstance', coreKitInstance, provider)
  if (coreKitInstance && provider) {
    console.log('createOrRestoreEIP155Wallet > init', coreKitInstance, provider)
    signer = EIP155Lib.init({ coreKitInstance })
  } else {
    console.log('createOrRestoreEIP155Wallet > init null')
    signer = EIP155Lib.init({ coreKitInstance: null })
  }

  address = await signer.getAddress() ?? ''
  console.log('createOrRestoreEIP155Wallet > address', address)
  console.log('createOrRestoreEIP155Wallet > signer', signer)

  eip155Wallets = {
    [address]: signer,
  }
  eip155Addresses = Object.keys(eip155Wallets)

  console.log('createOrRestoreEIP155Wallet > eip155Addresses', eip155Addresses)

  return {
    eip155Wallets,
    eip155Addresses
  }
}
