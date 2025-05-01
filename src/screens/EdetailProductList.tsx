import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Orientation from 'react-native-orientation-locker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import EdetaillMslDetails from '../components/EdetaillMslDetails';
import { IspecialityOrderByList, MSLDetailsinterface, UniqueProductFileOutput, uniqueProductOutPutList } from '../components/interfaces';
import { GET_MSLplannedproduct_byMSLID, GetProductDetails } from '../services/dbServices';
import EdetailSlideShow from '../components/EdetailSlideShow';
import Loader from '../components/Loader';
import EdetailTabsScreen from '../components/EdetailTabsScreen';


const EdetailProductList = () => {
    const [loader, setLoader] = useState<boolean>(true)
    const [MSlrelatedProducts, setMSlrelatedProducts] = useState<UniqueProductFileOutput[]>([]);
    const [planningOrEdetailing, setplanningOrEdetailing] = useState<number>(0);
    const [selectedMslDetails, setSelectedDetails] = useState<MSLDetailsinterface | null>(null);
    const [plannedProducts, setPlannedProducts] = useState<UniqueProductFileOutput[]>([]);
    const [AllProducts, setAllProducts] = useState<UniqueProductFileOutput[]>([]);
    const [MSLplannedproductslocal, setMSLplannedproductslocal] = useState<[]>([]);
    const [Unplannedproducts, setUnplannedproducts] = useState<UniqueProductFileOutput[]>([]);
    const [planningOrEdetailingIdentifier, setplanningOrEdetailingIdentifier] = useState<number>(0);
    const [ManualProducts,setManualProducts] = useState<uniqueProductOutPutList[]>([])
    useEffect(() => {
        Orientation.lockToLandscapeLeft();
    }, [])

    useEffect(() => { 
        setplanningOrEdetailing(planningOrEdetailingIdentifier);        
    }, [
        MSlrelatedProducts,
        loader,
        planningOrEdetailing,
        selectedMslDetails,
        plannedProducts,
        MSLplannedproductslocal,
        Unplannedproducts,
        ManualProducts
    ])

    const _doMSLSelected = (identifier: number, seletedMSl: MSLDetailsinterface) => {
        if (identifier === 0) {
            setplanningOrEdetailingIdentifier(identifier);
            setSelectedDetails(seletedMSl);
            _doMSLPlanning(seletedMSl);
        } else if (identifier === 1) {
            setplanningOrEdetailingIdentifier(identifier);
            setSelectedDetails(seletedMSl);
            _doMSLPlanning(seletedMSl);
        }
    }

    const _doMSLPlanning = async (seletedMSl: MSLDetailsinterface) => {
        setLoader(true)
        const productoutDetails = await GetProductDetails("unique_Product_output");
        if ((productoutDetails.unique_Product_output) != undefined && productoutDetails.unique_Product_output != null && JSON.parse(productoutDetails.unique_Product_output).length > 0) {
            const downloadedProductOutput = (JSON.parse(productoutDetails.unique_Product_output)).filter((f: uniqueProductOutPutList) => f.fileExist === true);
            if (downloadedProductOutput.length > 0) {
                const getSpaciaityList = downloadedProductOutput.filter((f: uniqueProductOutPutList) => f.specialityOrderByList.find((sf: IspecialityOrderByList) => (sf.Speciality_Name).toLowerCase() === (seletedMSl.Speciality_Name).toLowerCase()));
                if (getSpaciaityList.length > 0) {
                    const getUniqueProductFileoutput = await GetProductDetails("unique_ProductFile_output");
                    if ((getUniqueProductFileoutput.unique_ProductFile_output) != undefined && getUniqueProductFileoutput.unique_ProductFile_output != null && JSON.parse(getUniqueProductFileoutput.unique_ProductFile_output).length > 0) {
                        setAllProducts(JSON.parse(getUniqueProductFileoutput.unique_ProductFile_output));
                        const getProductFiles = JSON.parse(getUniqueProductFileoutput.unique_ProductFile_output).filter((f: any) => getSpaciaityList.some((gs: any) => f.ProductGroup_ID === gs.ProductGroup_ID));
                        setMSlrelatedProducts(getProductFiles);
                    }
                }
            }
        }
        await _dologicBehindScreen(3);
        // setLoader(false);
    }

    const _doGetPlannedDetails = async () => {
        let mslplanneddetails: any = [];
        if (selectedMslDetails) {
            if (Number(selectedMslDetails.MSL_ID) == 0) {
                // mslplanneddetails = await GET_MSLplannedproduct_byMSLID(this.NonMSLnameTxt, this.data.selectulspecialid, this.data.selectmarketareaid, 0).__zone_symbol__value;
            } else {
                mslplanneddetails = await GET_MSLplannedproduct_byMSLID('', 0, 0, 0, selectedMslDetails);
            }
        }
        return mslplanneddetails.length > 0 ? mslplanneddetails : [];
    }

    const _dologicBehindScreen = async (val: number) => {
        try {
            let mslplanneddetails: any = [];
            mslplanneddetails = await _doGetPlannedDetails();
            console.log("mslplanneddetails",mslplanneddetails);
            
            const plannedProduct = AllProducts.filter(ep => mslplanneddetails.find((mp: any) => mp.ProductFile_ID == ep.ProductFile_ID));
            if (val === 3 || val === 0) {
                if (mslplanneddetails.length > 0) {
                    if (AllProducts) {
                        setPlannedProducts(plannedProduct);
                        setMSLplannedproductslocal(mslplanneddetails);
                    }
                } else {
                    setPlannedProducts([]);
                    setMSLplannedproductslocal([]);
                }
            }
    
            if (val === 3 || val === 1) {
                let Unplannedproducts = AllProducts.filter(all => plannedProduct.every(sp => sp.ProductFile_ID != all.ProductFile_ID) && MSlrelatedProducts.find(mp => mp.ProductFile_ID == all.ProductFile_ID));
                Unplannedproducts.length > 0 ? setUnplannedproducts(Unplannedproducts) : setUnplannedproducts([])
            }
    
            if (val === 3 || val === 2) {
                const productoutDetails = await GetProductDetails("unique_Product_output");
                let manualproducts:any = JSON.parse(productoutDetails.unique_Product_output);
                manualproducts.length > 0 ? setManualProducts(manualproducts) :[];
                if (mslplanneddetails.length > 0) {
                   let manualSelectedProducts:any = JSON.parse(productoutDetails.unique_Product_output).filter((up: any) => mslplanneddetails.find((ms: any) => ms.ProductGroup_ID == up.ProductGroup_ID));
                    let manualunselected: any = manualproducts.filter((up:any) => mslplanneddetails.every((ms:any) => ms.ProductGroup_ID != up.ProductGroup_ID));
                    console.log("manualSelectedProducts",manualSelectedProducts);
                    console.log("manualunselected",manualunselected);
                }
    
            }
            setTimeout(() => {
                setLoader(false)
            }, 500);
        } catch (error) {
            console.log(error);
            
        }
    }

    const _doChooseMslInList = () => {
        setplanningOrEdetailing(2);
        setMSlrelatedProducts([]);
    }

    // logicbehindTabscreen(val) {


    //     let thisval: any = this;
    //     if (val == 3 || val == 0) {
    //       /* Planned Products  for selected MSL*/
    //       this.plannedproducts = [];
    //       let mslplanneddetails: any;

    //       if (getNumber("selectedMSL_id") == 0) {
    //         mslplanneddetails = this.localData.GET_MSLplannedproduct_byMSLID(this.NonMSLnameTxt, this.data.selectulspecialid, this.data.selectmarketareaid, 0).__zone_symbol__value;
    //       } else {
    //         mslplanneddetails = this.localData.GET_MSLplannedproduct_byMSLID('', 0, 0, 0).__zone_symbol__value;
    //       }


    //       if (mslplanneddetails.length > 0) {
    //         this.plannedproducts = this.AllProdList.filter(ep => mslplanneddetails.find(mp => mp.ProductFile_ID == ep.ProductFile_ID)).sort(function (a, b) { return a.id - b.id });
    //         this.ImgList = this.MSLplannedproductslocal;
    //         this.ImgList.forEach((ele) => {
    //           ele.loadImage = true;
    //         })
    //         // this.MSLplannedproductslocal = mslplanneddetails;
    //         this._doAddAutoSelectSlides(); //======================================Add _AddAutoSelectSlides autoslides===================

    //         this.tabIndex = 0;
    //       } else {
    //         this.plannedproducts = [];
    //         this.tabIndex = 1;
    //       }
    //       this.productprocess = false;
    //       this.commonfun._doHideLoader();
    //     }

    //     if (val == 3 || val == 1) {
    //       /* UnPlanned Products  for selected MSL*/
    //       this.Unplannedproducts = this.AllProdList.filter(all => this.plannedproducts.every(sp => sp.ProductFile_ID != all.ProductFile_ID) && this.MSLrelatedproducts.find(mp => mp.ProductFile_ID == all.ProductFile_ID));
    //       this.Unplannedproducts.forEach((ele, i) => {
    //         ele.loadImage = true;
    //       })
    //       this.tempArray = this.Unplannedproducts;
    //       // this.ImgList = this.plannedproducts;
    //       // this._doLazyloadUnplannedproducts(data);

    //       this.ImgList = this.MSLplannedproductslocal;
    //       this.ImgList.forEach((ele) => {
    //         ele.loadImage = true;
    //       })
    //       this.productprocess = false;
    //       this.commonfun._doHideLoader();

    //     }

    //     if (val == 3 || val == 2) {
    //       this.manualproducts = JSON.parse(getString("UniqueProductList"));
    //       let getmanualselected: any;
    //       if (getNumber("selectedMSL_id") == 0) {
    //         getmanualselected = this.localData.GET_MSLplannedproduct_byMSLID(this.NonMSLnameTxt, this.data.selectulspecialid, this.data.selectmarketareaid, 0).__zone_symbol__value;
    //       } else {
    //         getmanualselected = this.localData.GET_MSLplannedproduct_byMSLID('', 0, 0, 0).__zone_symbol__value;
    //       }
    //       if (getmanualselected.length > 0) {
    //         let manualselected: any = JSON.parse(getString("UniqueProductList")).filter(up => getmanualselected.find(ms => ms.ProductGroup_ID == up.ProductGroup_ID));
    //         let manualunselected: any = JSON.parse(getString("UniqueProductList")).filter(up => getmanualselected.every(ms => ms.ProductGroup_ID != up.ProductGroup_ID));
    //         if (manualselected.length > 0) {
    //           manualselected.forEach(ele => {
    //             let imgselmanual: any = this.page.getViewById<Image>("manual" + ele.ProductGroup_ID);
    //             if (imgselmanual != undefined) {
    //               imgselmanual.src = "~/images/selecton.png";
    //             }
    //           });
    //         }
    //         if (manualunselected.length > 0) {
    //           manualunselected.forEach(ele => {
    //             let imgselmanual: any = this.page.getViewById<Image>("manual" + ele.ProductGroup_ID);
    //             if (imgselmanual != undefined) {
    //               imgselmanual.src = "";
    //             }
    //           });
    //         }
    //       }
    //       this.productprocess = false;
    //       this.commonfun._doHideLoader();

    //     }

    //     this._doAddAutoSelectSlides(); //======================================Add _AddAutoSelectSlides autoslides===================
    //     setTimeout(() => {
    //       thisval._doShowNumbers();
    //       this._doAddcoverimages(this.MSLplannedproductslocal);
    //     }, 150);
    //   }


    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={{ flex: 1.5, backgroundColor: '#ccc' }}>
                        <EdetaillMslDetails onpress={(identifier: number, seletedMSl: MSLDetailsinterface) => _doMSLSelected(identifier, seletedMSl)} onPressMslList={() => _doChooseMslInList()} />
                    </View>
                    {
                        planningOrEdetailing === 0 ? (MSlrelatedProducts.length > 0 ?
                            <View style={{ flex: 4.5, backgroundColor: '#fff', width: '100%', height: '100%' }}>
                                {loader ? (
                                    <Loader />
                                ) : MSlrelatedProducts.length > 0 ? (
                                    <EdetailSlideShow MSLrelatedProductSlides={MSlrelatedProducts} selectedMsl={selectedMslDetails} />
                                ) : (
                                    <View style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '100%' }}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '100%' }}>
                                            <Text>No Product Found</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                            : <View style={{ flex: 4.5, backgroundColor: '#fff', width: '100%', height: '100%' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '100%' }}>
                                    <Text>No Product Found</Text>
                                </View>
                            </View>)

                            : (
                                planningOrEdetailing === 1 ?
                                    <View style={{ flex: 4.5, backgroundColor: '#fff', width: '100%', height: '100%' }}>
                                        {loader ? (
                                            <Loader />
                                        ) : MSlrelatedProducts.length > 0 ? (
                                            <EdetailTabsScreen MSLplannedproductslocal={MSLplannedproductslocal} Unplannedproducts={Unplannedproducts} ManualProducts={ManualProducts} />
                                        ) : (
                                            <View style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '100%' }}>
                                                <Text>No Product Found</Text>
                                            </View>
                                        )}
                                    </View>
                                    : <View style={{ flex: 4.5, backgroundColor: '#fff', width: '100%', height: '100%' }}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '100%' }}>
                                            <Text>No Product Found</Text>
                                        </View>
                                    </View>
                            )
                    }
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
});

export default EdetailProductList