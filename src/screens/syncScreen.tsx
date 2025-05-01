import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { mediaQueries } from '../assets/fonts/media-queries';
import CustomButton from '../components/CustomButton';
import { Get_Login_Output_Details, GetProductDetails, GetRepSyncColumnDetails, Insert_Product_Details, InsertGetRepOwnSyncDetails, updateRepSyncColumDetails, updateUniqueProductList } from '../services/dbServices';
import ProfileHeader from '../components/profileHeader';
import { EmployeeOutput, LoginDetails, ModelMultiSelection, ProductLanguage } from '../components/interfaces';
import ethosServices from '../services/ethosServices';
import Loader from '../components/Loader';
import ModalView from '../components/modal';
import { Toast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS, { DownloadBeginCallbackResult, DownloadProgressCallbackResult } from 'react-native-fs';
import { unzip } from 'react-native-zip-archive'
import ProgressBar from '../components/Progress';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/appNavigation';
import { useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';

interface ZipFileDetail {
  ZipFilePath: {
    Link: string;
    EdetailingLanguageId: string;
  }[];
  id: number;
  ProductGroup_ID: number;
  EdetailingLanguageId: number;
}

const SyncScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [loginData, setLoginData] = useState<LoginDetails | null>(null);
  const [loading, setLoadingState] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<ModelMultiSelection[]>([]);
  const [resetState, setResetState] = useState(true);
  const [modelFlag, setModelFlag] = useState('');
  const [productsUniqueList, setProductUniqueList] = useState<any>([]);
  const [progress, setProgress] = useState<number>(0);
  const [content, setContentLenght] = useState<number>(0);
  const [downloadingItem, setDownloadingItem] = useState<number | null>(null);
  const [downloadOneByOne, setdownloadOneByOne] = useState<number>(0);
  const [saveSelectedZipFileDetails, setSaveSelectedZipFileDetails] = useState<ZipFileDetail | null>(null);
  const [count, setCount] = useState<number>(0);
  const [nameState, setNameState] = useState<string>("");
  const [downloadProductLoader, setDownloadProductLoader] = useState<boolean>(false);

  useEffect(() => {
    Orientation.unlockAllOrientations();
    _doGetDataFromLoginPage();
  }, [])

  useEffect(() => {
    console.log("count is : ", count);
    console.log("nameState is : ", nameState);
    _doCheckStateIsUpdatingOrnot();

  }, [count, nameState])

  useEffect(() => {
    console.log("downloadOneByOne", downloadOneByOne);
    console.log("saveSelectedZipFileDetails", saveSelectedZipFileDetails);
    _doStartDownload();
  }, [downloadOneByOne, saveSelectedZipFileDetails])

  const _doGetDataFromLoginPage = async () => {
    setLoadingState(true);
    const loginDetails: any = await Get_Login_Output_Details();
    console.log("SyncScreen", loginDetails);
    if (loginDetails.length > 0) {
      setLoginData(loginDetails[0]);
    }
    _doFileExist();
    setLoadingState(false);
    setdownloadOneByOne(0);
    setSaveSelectedZipFileDetails(null);
    setDownloadingItem(null);
  }

  const _doGetOwnDetails = () => {
    console.log("_doGetOwnDetails", loginData);

    if (Number(loginData?.Authentication) === 25) {
      const body = {
        employeeid: Number(loginData?.Employee_ID),
        subterritoryid: Number(loginData?.Sub_Territory_ID),
        designationid: loginData?.Designation_ID.toString(),
        divisionid: Number(loginData?.Division_ID),
      };
      console.log(body);
      setLoadingState(true);
      console.log("loading", loading);
      ethosServices.post(body, "login/SyncRep").then(async (res) => {
        console.log("_doGetOwnDetails---Rep", res);
        InsertGetRepOwnSyncDetails(res);
        setLoadingState(false);
      })
    }
    if (Number(loginData?.Authentication) === 197) {
      const body = {
        employeeid: Number(loginData?.Employee_ID),
        subterritoryid: Number(loginData?.Sub_Territory_ID),
        designationid: loginData?.Designation_ID.toString(),
        divisionid: Number(loginData?.Division_ID),
      };
      console.log(body);
      setLoadingState(true);
      ethosServices.post(body, "login/SyncManager").then(async (res) => {
        console.log("login/SyncManager", res);
        InsertGetRepOwnSyncDetails(res);
        setLoadingState(false);
      })
    }
  }

  const _doClearLogout = () => {
    console.log("clear Logout ");
    navigation.reset({
      index: 0,
      routes: [{ name: 'login' }]
    });
    // Toast.show("Check the toast is working fine or not",{ type : 'warning'})
  }

  const _doOpenModal = async (flag: string) => {
    try {
      console.log("---",flag);
      
      setModelFlag(flag);
      if (flag === "empDetails") {
        const getEmpOutPutDetails = await GetRepSyncColumnDetails('emp_output');
        console.log("getEmpOutPutDetails",getEmpOutPutDetails);
        
        if (JSON.parse(getEmpOutPutDetails.emp_output).length > 0) {
          const modifiedData = JSON.parse(getEmpOutPutDetails.emp_output).map((ele: EmployeeOutput) => {
            let data = {
              'id': ele.Employee_ID,
              'name': ele.Employee_Name,
              'selected': false,
              "subteritoryId": ele.Sub_Territory_ID,
              'flag': 'empDetails'
            }
            return data;
          })
          setModalData(modifiedData);
          setModalVisible(true);
        } else {
          Toast.show("Employee Details not found", { type: 'warning' })
        }
      } else if (flag === "productDetails") {
        _doSyncProduts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _doGetSeletedDataFromModel = (selectedItems: ModelMultiSelection[]) => {
    console.log("selectedItems", selectedItems);
    if (selectedItems.length > 0 && modelFlag === 'empDetails') {
      _doSyncEmpDetails(selectedItems)
    } else if (selectedItems.length > 0 && modelFlag === 'productDetails') {
      _doSyncProductDetails(selectedItems)
    }
  }

  const _doSyncEmpDetails = async (selectedItems: ModelMultiSelection[]) => {
    let teamListSubteritoryIdMerge = selectedItems.map((item) => item.subteritoryId.toString());
    await AsyncStorage.setItem('teamListSubteritoryIdMerge', JSON.stringify(teamListSubteritoryIdMerge));
    console.log("loginData", loginData);
    let body = {
      selectedsubterritoryid: teamListSubteritoryIdMerge.join(','),
      employeeid: loginData!.Employee_ID,
      subterritoryid: loginData!.Sub_Territory_ID,
      divisionid: loginData!.Division_ID,
      selecteddivision: "",
    };
    try {
      setLoadingState(true);
      ethosServices.post(body, "login/SyncManagerRep").then(async (result) => {
        const SyncManagerRep = result;        
        const body = {
          employeeid: Number(loginData?.Employee_ID),
          subterritoryid: Number(loginData?.Sub_Territory_ID),
          designationid: loginData?.Designation_ID.toString(),
          divisionid: Number(loginData?.Division_ID),
        };
        console.log(body);
        ethosServices.post(body, "login/SyncManager").then(async (res) => {
          const SyncOwnDetails = res;
          await _doMergeSyncManagerDetails(SyncManagerRep, SyncOwnDetails)
          setLoadingState(false);
        })

      })
    } catch (error) {
      setLoadingState(false);
    }
  }

  const _doSyncProductDetails = (selectedItems: ModelMultiSelection[]) => {
    if (selectedItems.length > 0) {
      const concatenatedIds = selectedItems.map((lang: ModelMultiSelection) => lang.id).join(',');
      let segmentId = (loginData?.Employee_ID)?.toString();
      const body = {
        employeeid: Number(loginData?.Employee_ID),
        subterritoryid: Number(loginData?.Sub_Territory_ID),
        divisionid: Number(loginData?.Division_ID),
        languageid: concatenatedIds,
        teamemployeeid: segmentId,
      };

      setLoadingState(true);
      ethosServices.post(body, 'login/SyncProduct').then((res) => {
        Insert_Product_Details(res).then(() => {
          console.log("Product details inserted successfully");
          _doCheckUniqueProducts();
        })
          .catch((e) => {
            console.log(e);
            setLoadingState(false);
          });
      })
        .catch((err) => {
          setLoadingState(false);
          Toast.show("Server not found. Please try to sync the product details");
        });
    }
  };



  const _doMergeSyncManagerDetails = async (SyncManagerRep: any, SyncOwnDetails: any) => {
    //Merge msloutput from sync Manger Details and Sync own Details
    console.log("SyncManagerRep.msloutput",JSON.parse(SyncManagerRep.msloutput));
    console.log("SyncOwnDetails.msloutput",JSON.parse(SyncOwnDetails.msloutput));
    
    
    if (JSON.parse(SyncManagerRep.msloutput).length > 0 && JSON.parse(SyncOwnDetails.msloutput).length > 0 &&
      SyncManagerRep.msloutput != null && SyncOwnDetails.msloutput != null && SyncManagerRep.msloutput != undefined && SyncOwnDetails.msloutput != undefined) {
      const mergedMslOutputList = [...JSON.parse(SyncManagerRep.msloutput), ...JSON.parse(SyncOwnDetails.msloutput)];
      const uniqueMergedArray = mergedMslOutputList.filter((value: any, index, self) =>
        index === self.findIndex((t: any) => t.MSL_ID === value.MSL_ID)
      );
      console.log("uniqueMergedArray",uniqueMergedArray);
      console.log("uniqueMergedArrayLength",uniqueMergedArray.length);
      await updateRepSyncColumDetails("msloutput", JSON.stringify(uniqueMergedArray));
    } else if (JSON.parse(SyncManagerRep.msloutput).length > 0 && SyncManagerRep.msloutput != null && SyncManagerRep.msloutput != undefined) {
      console.log("else if entered ======================================",JSON.parse(SyncManagerRep.msloutput));
      await updateRepSyncColumDetails("msloutput", SyncManagerRep.msloutput);
    } else if (JSON.parse(SyncOwnDetails.msloutput).length > 0 && SyncOwnDetails.msloutput != null && SyncOwnDetails.msloutput != undefined) {
      await updateRepSyncColumDetails("msloutput", SyncOwnDetails.msloutput);
    }

    //Merge promo_output from sync Manger Details and Sync own Details
    if (JSON.parse(SyncManagerRep.promo_output).length > 0 && JSON.parse(SyncOwnDetails.promo_output).length > 0 &&
      SyncManagerRep.promo_output != null && SyncOwnDetails.promo_output != null && SyncManagerRep.promo_output != undefined && SyncOwnDetails.promo_output != undefined) {
      const mergedMslOutputList = [...JSON.parse(SyncManagerRep.promo_output), ...JSON.parse(SyncOwnDetails.promo_output)];
      const uniqueMergedArray = mergedMslOutputList.filter((value: any, index, self) =>
        index === self.findIndex((t: any) => t.PromoItem_Dispatched_ID === value.PromoItem_Dispatched_ID)
      );
      await updateRepSyncColumDetails("promo_output", JSON.stringify(uniqueMergedArray));
    } else if (JSON.parse(SyncManagerRep.promo_output).length > 0 && SyncManagerRep.promo_output != null && SyncManagerRep.promo_output != undefined) {
      await updateRepSyncColumDetails("promo_output", SyncManagerRep.promo_output);
    } else if (JSON.parse(SyncOwnDetails.promo_output).length > 0 && SyncOwnDetails.promo_output != null && SyncOwnDetails.promo_output != undefined) {
      await updateRepSyncColumDetails("promo_output", SyncOwnDetails.promo_output);
    }

    //Merge market_area_output from sync Manger Details and Sync own Details
    if (JSON.parse(SyncManagerRep.market_area_output).length > 0 && JSON.parse(SyncOwnDetails.market_area_output).length > 0 &&
      SyncManagerRep.market_area_output != null && SyncOwnDetails.market_area_output != null && SyncManagerRep.market_area_output != undefined && SyncOwnDetails.market_area_output != undefined) {
      const mergedMslOutputList = [...JSON.parse(SyncManagerRep.market_area_output), ...JSON.parse(SyncOwnDetails.market_area_output)];
      const uniqueMergedArray = mergedMslOutputList.filter((value: any, index, self) =>
        index === self.findIndex((t: any) => t.Market_Area_ID === value.Market_Area_ID)
      );
      await updateRepSyncColumDetails("market_area_output", JSON.stringify(uniqueMergedArray));
    } else if (JSON.parse(SyncManagerRep.market_area_output).length > 0 && SyncManagerRep.market_area_output != null && SyncManagerRep.market_area_output != undefined) {
      await updateRepSyncColumDetails("market_area_output", SyncManagerRep.market_area_output);
    } else if (JSON.parse(SyncOwnDetails.market_area_output).length > 0 && SyncOwnDetails.market_area_output != null && SyncOwnDetails.market_area_output != undefined) {
      await updateRepSyncColumDetails("market_area_output", SyncOwnDetails.market_area_output);
    }
  }

  const _doSyncProduts = async () => {
    let getProductLanguageDetails = await GetRepSyncColumnDetails("product_Language_output");
    if (JSON.parse(getProductLanguageDetails.product_Language_output) != null && JSON.parse(getProductLanguageDetails.product_Language_output) != undefined && JSON.parse(getProductLanguageDetails.product_Language_output).length > 0) {
      getProductLanguageDetails = JSON.parse(getProductLanguageDetails.product_Language_output);
      getProductLanguageDetails.forEach(async (ele: any) => {
        ele.selectedLanguage = false;
        if (ele.languageId === 1) {
          ele.selectedLanguage = true;
        }
      })
      if (getProductLanguageDetails.length > 0) {
        if (getProductLanguageDetails.length > 1) {
          console.log("getProductLanguageDetails", getProductLanguageDetails);
          const modifiedData = getProductLanguageDetails.map((ele: ProductLanguage) => {
            let data = {
              'id': ele.languageId,
              'name': ele.languageName,
              'selected': ele.selectedLanguage,
              'flag': 'productLanguageDetails'
            }
            return data;
          })
          setModalData(modifiedData);
          setModalVisible(true);
        } else if (getProductLanguageDetails.length === 1) {
          getProductLanguageDetails.forEach((ele: any) => {
            ele.selectedLanguage = true;
          })
          let getFilteredSelectedLanguage = getProductLanguageDetails.filter((item: ProductLanguage) => item.selectedLanguage === true);
          const modifiedData = getProductLanguageDetails.map((ele: ProductLanguage) => {
            let data = {
              'id': ele.languageId,
              'name': ele.languageName,
              'selected': ele.selectedLanguage,
              'flag': 'productLanguageDetails'
            }
            return data;
          })
          setModalData(modifiedData);
          _doSyncProductDetails(modifiedData)

          // setModalVisible(true);
          await AsyncStorage.setItem('SelectedProductLanguage', JSON.stringify(getFilteredSelectedLanguage));
        }
      } else {
        Toast.show("Please sync own details", { type: 'warning' })
      }
    }
  }

  const _doCheckUniqueProducts = async () => {
    try {
      console.log("trigger");
      let productOutPut: any = [];
      await GetProductDetails("product_output").then(async (res) => {
        if (res) {
          productOutPut = JSON.parse(res.product_output);
          const uniqueProductsArray = productOutPut.filter((value: any, index: any, self: any[]) =>
            index === self.findIndex((t: any) => t.ProductGroup_ID === value.ProductGroup_ID)
          );
          let UniqueList = await Promise.all(uniqueProductsArray.map(async (ele: any, index: number) => {
            let zipfilePath = await Promise.all(JSON.parse(ele.ZipFilePath).map(async (item: any) => {
              const path = `${RNFS.DocumentDirectoryPath}/${item.EdetailingLanguageId}/${ele.ProductGroup_ID}`;
              const fileExist = await RNFS.exists(path);
              let Data = { ...item, 'fileExist': fileExist, };
              return Data;
            }));
            let filteredSpecialityId = productOutPut.filter((f: any) => ele.ProductGroup_ID === f.ProductGroup_ID)
            let modifyData = {
              "id": index + 1,
              "Division_ID": ele.Division_ID,
              "ProductGroup_ID": ele.ProductGroup_ID,
              "ProductGroup_Name": ele.ProductGroup_Name,
              "ZipFilePath": zipfilePath,
              "specialityOrderByList": filteredSpecialityId.map((item: any) => {
                let data = {
                  "IsShow": ele.IsShow,
                  "Speciality_ID": item.Speciality_ID,
                  "Speciality_Name": item.Speciality_Name,
                  "IsAutoSelect": item.IsAutoSelect,
                  "OrderBy": item.OrderBy,
                }
                return data
              })
            }
            return modifyData
          }))
          await updateUniqueProductList('unique_Product_output', UniqueList);
          console.log("UniqueList", UniqueList);
        }
      })

      let productFileOutput: any = [];
      await GetProductDetails("productfile_output").then(async (res) => {
        if (res) {
          productFileOutput = JSON.parse(res.productfile_output);
          console.log("productFileOutput", productFileOutput);
          let UniqueList = await Promise.all(productFileOutput.map(async (ele: any, index: number) => {
            try {
              const path = `${RNFS.DocumentDirectoryPath}/${ele.EdetailingLanguageId}/${ele.ProductGroup_ID}/${ele.ProductFile_ImageURL.split('/').pop()}`;
              const fileExist = await RNFS.exists(path);
              const fileSize = (await RNFS.stat(path)).size;
              let modifyData = {
                ...ele,
                'ProductFile_ImageURL_localPath': path,
                'fileExist': fileExist,
                'fileSize': fileSize
              };
              return modifyData;
            } catch (error) {
              return { ...ele, 'fileExist': false, 'fileSize': 0 };
            }
          }));
          console.log("UniqueList_ProductFile_output ----", UniqueList);
          await updateUniqueProductList('unique_ProductFile_output', UniqueList);
          _doFileExist();
        } else {
          console.log("No response from GetProductDetails");
        }
      });


    } catch (error) {
      setLoadingState(false)
      setDownloadProductLoader(false)
    }

  }

  const _doFileExist = async () => {
    try {
      let uniqueProductOutput: any = await GetProductDetails('unique_Product_output');
      console.log(uniqueProductOutput);
      
      let uniqueProductFileOutput: any = await GetProductDetails('unique_ProductFile_output');

      const uniqueProductData = JSON.parse(uniqueProductOutput.unique_Product_output)
      const uniqueProductFileData = JSON.parse(uniqueProductFileOutput.unique_ProductFile_output)
      console.log("uniqueProductFileData===", uniqueProductFileData);

      for (let ele of uniqueProductData) {
        const fileExist = uniqueProductFileData.filter((f: { fileExist: boolean, ProductGroup_ID: number }) => f.fileExist === false && ele.ProductGroup_ID === f.ProductGroup_ID);
        fileExist.length > 0 ? ele.fileExist = false : ele.fileExist = true
      }
      console.log("Updated Product Data:", uniqueProductData);
      await updateUniqueProductList('unique_Product_output', uniqueProductData);
      setProductUniqueList(uniqueProductData);
      setLoadingState(false);
      setDownloadProductLoader(false)
    } catch (error) {
      console.log(error);
      setDownloadProductLoader(false)
      setLoadingState(false);
    }
  }


  const _doDownloadOneByone = async (item: any) => {
    console.log("item==========", item);
    const downloadList: any = { ...item };
    downloadList.ZipFilePath = [];
    let copyZipFiles = [...item.ZipFilePath];
    await GetProductDetails("unique_ProductFile_output").then(async (res) => {
      let uniqueProductFileOutput = JSON.parse(res.unique_ProductFile_output);
      console.log("uniqueProductFileOutput", uniqueProductFileOutput);

      let filterUniqueProduct = [];
      let filterZipfileData = [];
      filterZipfileData = copyZipFiles.filter((f: any) => f.fileExist === false);
      filterUniqueProduct = uniqueProductFileOutput.filter((f: any) => f.ProductGroup_ID === item.ProductGroup_ID && f.fileExist === false);

      if (item.fileExist === false) { // zip file download 
        if (filterZipfileData.length > 0) {
          if (downloadList.ZipFilePath.length === 0) {
            downloadList.ZipFilePath = filterZipfileData;
          }
        }
      }
      if (filterUniqueProduct.length > 0 && (copyZipFiles.length)) { // missed files download
        filterUniqueProduct = filterUniqueProduct.map((f: any) => {
          let data = {
            'EdetailingLanguageId': f.EdetailingLanguageId,
            'LanguageName': "",
            'Link': f.ProductFile_ImageURL,
            'fileExist': f.fileExist
          }
          return data
        })
        if (downloadList.ZipFilePath.length === 0) {
          downloadList.ZipFilePath = filterUniqueProduct;
        }
      }
      if (item.fileExist === false && filterUniqueProduct.length > 0 && filterZipfileData.length > 0) { //missed files and zip files download
        const removeDuplicatesUniqueProduct = [...filterUniqueProduct];
        const removeDuplicatesZipfileData = [...filterZipfileData];
        const downloadListFindWithoutDuplicates = removeDuplicatesUniqueProduct.filter((up: any) =>
          !removeDuplicatesZipfileData.some((zf) => up.EdetailingLanguageId === zf.EdetailingLanguageId)
        );

        console.log("removeDuplicates", downloadListFindWithoutDuplicates);
        console.log("filterZipfileData", filterZipfileData);
        downloadList.ZipFilePath = [...filterZipfileData, ...downloadListFindWithoutDuplicates];
      }
    })

    console.log("downloadList", downloadList);
    setSaveSelectedZipFileDetails(downloadList);
    setdownloadOneByOne(0);
    setDownloadProductLoader(true);
  }

  const _doStartDownload = async () => {
    if (saveSelectedZipFileDetails && saveSelectedZipFileDetails != null) {
      const item: ZipFileDetail = saveSelectedZipFileDetails;
      console.log(item, "item");
      setDownloadingItem(item.id);
      let productZipFilePathList = item.ZipFilePath;
      const url: string = productZipFilePathList[downloadOneByOne].Link.replace('https', 'http');

      console.log("url", url);

      if (url !== undefined && url !== null) {
        const fromUrl = url;
        const directory = `${RNFS.DocumentDirectoryPath}/${productZipFilePathList[downloadOneByOne].EdetailingLanguageId}/${item.ProductGroup_ID}`;
        const exists = await RNFS.exists(directory);
        if (!exists) {
          await RNFS.mkdir(directory);
        }
        const toFile = `${RNFS.DocumentDirectoryPath}/${productZipFilePathList[downloadOneByOne].EdetailingLanguageId}/${item.ProductGroup_ID}/${url.split('/').pop()}`;
        const options = {
          fromUrl: fromUrl,
          toFile: toFile,
          begin: (res: DownloadBeginCallbackResult) => {
          },
          progress: (res: DownloadProgressCallbackResult) => {
            setProgress(res.bytesWritten);
            setContentLenght(res.contentLength);
          },
        };

        try {
          const res = await RNFS.downloadFile(options).promise;
          setDownloadingItem(null);

          if (res.statusCode === 200) {
            setTimeout(() => {
              const targetPath = directory;
              const sourcePath = toFile;
              if (url.includes('zip')) {
                unzip(sourcePath, targetPath)
                  .then((path) => {
                    console.log(`zip completed at ${path}`);
                    setTimeout(() => {
                      if (productZipFilePathList.length > downloadOneByOne + 1) {
                        setdownloadOneByOne(downloadOneByOne + 1);
                      } else {
                        _doCheckUniqueProducts();
                        setdownloadOneByOne(0);
                        setSaveSelectedZipFileDetails(null);
                      }
                    }, 50);
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              } else {
                setTimeout(() => {
                  if (productZipFilePathList.length > downloadOneByOne + 1) {
                    setdownloadOneByOne(downloadOneByOne + 1);
                  } else {
                    _doCheckUniqueProducts();
                    setdownloadOneByOne(0);
                    setSaveSelectedZipFileDetails(null);
                  }
                }, 50);
              }
            }, 100);
          } else {
            Toast.show("The products not able to be download.", { type: 'warning' });
          }
        } catch (error) {
          setDownloadingItem(null);
          setDownloadProductLoader(false);
        }
      }
    }
    //  else {
    //   Toast.show("Please login again and try once", { type: 'warning' })
    // }
  };

  const _doUpdateState = (item: string) => {
    setCount(0),
      setNameState(item);
  };

  const _doCheckStateIsUpdatingOrnot = () => {
    console.log("_doCheckStateIsUpdatingOrnot", count);
    console.log("_doCheckStateIsUpdatingOrnot", nameState);
  };
  const _doCloseModal = () => {
    setModalVisible(false);
  };

  const _doGotoHomePage = () => {
    navigation.reset({
      index:0,
      routes:[{name:'home'}]
    })
  }

  if (loading) {
    return (
      <Loader />
    );
  } else {
    return (
      <SafeAreaProvider>
        <SafeAreaView>
          <View style={style.bottomButton}>
            <View style={style.mainContainer}>
              <View style={style.headerContiner}>
                <Text style={style.text}> Data Sync</Text>
                <CustomButton title="Clear Log Out" color='#00c9b7' width='20%' onPress={() => _doClearLogout()}></CustomButton>
              </View>
              <View style={style.profileContiner}>
                <ProfileHeader onClose={_doClearLogout} />
              </View>
              <View style={style.syncButtonContiner}>
                <Text style={style.text}>Sync your own details</Text>
                <CustomButton title="Click Here" color='#c1a78d' width='20%' onPress={() => _doGetOwnDetails()}></CustomButton>
              </View>
              <View style={style.syncButtonContiner}>
                <Text style={style.text}> Sync your employee details</Text>
                <CustomButton title="Click Here" color='#c1a78d' width='20%' onPress={() => _doOpenModal('empDetails')}></CustomButton>
              </View>

              <View style={style.syncButtonContiner}>
                <Text style={style.text}> Sync your product details</Text>
                <CustomButton title="Click Here" color='#c1a78d' width='20%' onPress={() => _doOpenModal("productDetails")}></CustomButton>
              </View>

              <View style={[style.productsContainer, { backgroundColor: '#ccc', padding: 10 }]}>
                <Text style={[style.productTableHeaders, { padding: 10, width: '10%' }]}>S.No</Text>
                <Text style={[style.productTableHeaders, { width: '50%' }]}>Product Name</Text>
                <Text style={[style.productTableHeaders, { width: '25%' }]}>Download Staus</Text>
                <Text style={[style.productTableHeaders, { width: '15%' }]}>Total:{productsUniqueList.length > 0 ? productsUniqueList.length : 0}</Text>
              </View>
              <ScrollView>
                {productsUniqueList && productsUniqueList.length > 0 ? (
                  productsUniqueList.map((item: any) => (
                    <View key={item.id} style={style.productsContainer}>
                      <Text style={[style.productTableHeaders, { padding: 10, width: '10%' }]}>
                        {item.id}
                      </Text>
                      <Text style={[style.productTableHeaders, { width: '50%' }]}>
                        {item.ProductGroup_Name}
                      </Text>
                      {
                        item.fileExist ?
                          (<View style={{ width: "25%", justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>
                            <View style={style.imageContainer}>
                              <Image
                                source={require('../assets/images/selecton.png')}
                                style={style.image}
                              ></Image>
                            </View>
                          </View>
                          ) : (
                            <CustomButton
                              title="Click Here"
                              color="#c1a78d"
                              width="25%"
                              onPress={() => _doDownloadOneByone(item)}
                            />
                          )
                      }
                      {
                        downloadingItem === item.id ?
                          <ProgressBar DownloadContent={content} DownloadProgress={progress} />
                          : null
                      }
                      <Text style={[style.productTableHeaders, { width: '15%' }]}></Text>
                    </View>


                  ))
                ) : (
                  <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text>No products available</Text>
                  </View>
                )}
              </ScrollView>
            </View>
            <View style={style.buttonHeight}>
              <CustomButton
                title="Back to Home"
                color="#00c9b7"
                width="100%"
                onPress={() => _doGotoHomePage()}
              />
            </View>
            <ModalView
              visible={modalVisible}
              onClose={_doCloseModal}
              resetCheckboxState={resetState}
              data={modalData} onSubmit={(selectedItems: ModelMultiSelection[]) => { _doGetSeletedDataFromModel(selectedItems) }}
            />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    )
  }


}

export default SyncScreen

const style = StyleSheet.create({
  buttonHeight: {
    height: 100,
    marginLeft: 10,
    marginRight: 10
  },
  bottomButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  },
  mainContainer: {
    backgroundColor: "#fff",
    height: "95%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  headerContiner: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 0
  },
  text: {
    fontSize: mediaQueries.fontSize.medium,
    // marginBottom: 5
  },
  profileContiner: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  syncButtonContiner: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
    paddingLeft: 10,
  },
  productsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10
  },
  productTableHeaders: {
    fontSize: mediaQueries.fontSize.medium,
    fontWeight: 600,
    textAlign: 'center',
    flexWrap: 'wrap'
    // marginBottom: 5
  },
  imageContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 2,
    height: 40,
    width: 40,
    borderColor: '#000',
    // padding: 4,
    backgroundColor: '#fff',
    // marginRight: 10
  },
  image: {
    borderRadius: 50,
    height: 30,
    width: 30
  },
})