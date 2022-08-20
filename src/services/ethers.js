import { ethers } from "ethers";
import ethereum from "./ethereum";
import UserService from "./user";
import store from "../store";
import { ETHERS, ETHERS_SET_ACCOUNT } from "../store/actions/ethers";
import DigiNFT from "../../contract.json";

const contractAddress = process.env.VUE_APP_CONTRACT_ADDRESS;

export default class EthersService {
  constructor() {
    const eth = ethereum();
    if (!eth) {
      return undefined;
    }
    this.eth = eth;
    this.provider = new ethers.providers.Web3Provider(this.eth, "any");
    const signer = this.provider.getSigner();
    this.contract = new ethers.Contract(contractAddress, DigiNFT.abi, signer);
  }

  async connectWallet() {
    const accounts = await this.eth.request({
      method: "eth_requestAccounts",
    });
    if (accounts.length !== 0) {
      const account = accounts[0];
      await UserService.sign(account);
      store.dispatch(`${ETHERS}/${ETHERS_SET_ACCOUNT}`, account);
    }
  }

  async buyItem(itemId, sellable, price) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, DigiNFT.abi, signer);

    const buy = await contract.buyItem(itemId, sellable, { value: price });

    return buy.wait();
  }

  async getMarketItem(itemId) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, DigiNFT.abi, signer);

    const item = await contract.getMarketItem(itemId);

    return item;
  }

  async burnItem(itemId) {
    const burn = await this.contract.burn(itemId);

    return burn.wait();
  }

  async mint(metadataUrl, price, royalty, sellable) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, DigiNFT.abi, signer);

    const burn = await contract.createToken(
      metadataUrl,
      price,
      royalty,
      sellable
    );

    return burn.wait();
  }

  async updateItem(itemId, price, royalty, sellable) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, DigiNFT.abi, signer);

    const update = await contract.updateItem(itemId, price, royalty, sellable);

    return update.wait();
  }
}
