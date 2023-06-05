import { providers } from 'ethers'
import { Web3AuthMPCCoreKit } from "@web3auth/mpc-core-kit"

/**
 * Types
 */
interface IInitArgs {
  coreKitInstance: Web3AuthMPCCoreKit | null
}

/**
 * Library
 */
export default class EIP155Lib {
  signer: providers.JsonRpcSigner | null

  constructor(signer: providers.JsonRpcSigner | null) {
    this.signer = signer;
  }

  static init({ coreKitInstance }: IInitArgs) {
    if (coreKitInstance && coreKitInstance.provider) {
      const ethersProvider = new providers.Web3Provider(coreKitInstance.provider);
      const signer = ethersProvider.getSigner();
      return new EIP155Lib(signer)
    }
    return new EIP155Lib(null)
  }

  async getAddress() {
    if (!this.signer) {
      console.log("signer not initialized yet");
      return;
    }

    return await this.signer.getAddress();;
  }

  async signMessage(message: string) {
    if (!this.signer) {
      console.log("signer not initialized yet");
      return;
    }

    return await this.signer.signMessage(message);
  }

  async _signTypedData(domain: any, types: any, data: any) {
    if (!this.signer) {
      console.log("signer not initialized yet");
      return;
    }

    return await this.signer._signTypedData(domain, types, data);
  }

  async connect(provider: providers.JsonRpcProvider) {
    if (!this.signer) {
      console.log("signer not initialized yet");
      return;
    }

    return await this.signer.connect(provider);
  }

  async signTransaction(transaction: providers.TransactionRequest) {
    if (!this.signer) {
      console.log("signer not initialized yet");
      return;
    }

    return await this.signer.signTransaction(transaction);
  }
}
