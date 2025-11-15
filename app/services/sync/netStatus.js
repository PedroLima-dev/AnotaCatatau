import NetInfo from "@react-native-community/netinfo";

export function listenNetworkStatus(callback) {
  const unsubscribe = NetInfo.addEventListener(state => {
    callback(state.isConnected && state.isInternetReachable);
  });

  return unsubscribe;
}

export async function isOnline() {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable;
}
