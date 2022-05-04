import ethereum from "./ethereum";
import store from "../store";
import { ETHERS, ETHERS_SET_ACCOUNT } from "../store/actions/ethers";

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
}
