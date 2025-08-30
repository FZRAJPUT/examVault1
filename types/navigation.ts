export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Verification: { userData: any };
  Home: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 