export default function authHeader() {
  const walletAddress = localStorage.getItem("walletAddress");
  if (walletAddress !== null) {
    return { Authorization: "Address " + walletAddress };
  }

  return {};
}
