export default async () => {
  let ethereum;

  if (typeof window !== "undefined" && typeof window.ethereum != "undefined") {
    ethereum = window.ethereum;
  } else {
    alert("Please, install metamask");
  }
  return ethereum;
};
