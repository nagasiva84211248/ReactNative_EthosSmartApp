import DeviceInfo from "react-native-device-info";
import { useNetInfo } from "@react-native-community/netinfo";
import { Toast } from "react-native-toast-notifications";

// const { type, isConnected } = useNetInfo();
const ethosServices = {
  getApiUrl: "http://qa.himalayaethos.com/api/EthosSmartApp/",
  headers: { "Authorization": "Basic UHJhdGhlZXA6RVRIT1NASVNSI3Yx", "Content-Type": "application/json" },
  appVersion: "2.1.1",
  appControlVersion: "_V_2_1_1",

  _doGetDeviceInfo() {
    let manufature: any = DeviceInfo.getManufacturer();

    let osVersion: any = DeviceInfo.getApiLevel();
    let uuid: any = DeviceInfo.getUniqueId();

    const deviceInfo = {
      model: DeviceInfo.getModel(),
      deviceType: DeviceInfo.getDeviceType(),
      os: DeviceInfo.getSystemName(),
      osVersion: osVersion._j,
      sdkVersion: DeviceInfo.getSystemVersion(),
      language: 'en',
      manufacturer: manufature._j,
      uuid: uuid._j,
    };

    return JSON.stringify(deviceInfo);
  },


  post: async (body: any, endurl: string) => {
    // if (isConnected) {
      body.devicedetails = ethosServices._doGetDeviceInfo();
      body.appdetails = ethosServices.appVersion;
      console.log("post", body);

      console.log(JSON.stringify(body));
      let url = ethosServices.getApiUrl + endurl + ethosServices.appControlVersion;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: ethosServices.headers,
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        throw error;
      }
    // } else {
    //   Toast.show("Please check your internet or make sure the signal is strong before attempting.", { type: 'warning' })
    // }
  }

};



export default ethosServices;