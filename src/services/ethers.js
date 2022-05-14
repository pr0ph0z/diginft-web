import { ethers } from "ethers";
import ethereum from "./ethereum";
import store from "../store";
import { ETHERS, ETHERS_SET_ACCOUNT } from "../store/actions/ethers";
import DigiNFT from "../../contract.json";

const contractAddress = "0x94eb31620b82ab808531499683bfdd9a7d87cddb";

export default class EthersService {
  async connectWallet() {
    const eth = await ethereum();
    if (!eth) {
      return undefined;
    }

    const accounts = await eth.request({
      method: "eth_requestAccounts",
    });
    if (accounts.length !== 0) {
      const account = accounts[0];
      store.dispatch(`${ETHERS}/${ETHERS_SET_ACCOUNT}`, account);
    }
  }

  async buyItem(itemId, sellable, price) {
    const eth = await ethereum();
    if (!eth) {
      return undefined;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, DigiNFT.abi, signer);

    const buy = await contract.buyItem(itemId, sellable, { value: price });

    await buy.wait();
  }

  async getMarketItem(itemId) {
    const eth = await ethereum();
    if (!eth) {
      return undefined;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, DigiNFT.abi, signer);

    const item = await contract.getMarketItem(itemId);

    return item;
  }
}
