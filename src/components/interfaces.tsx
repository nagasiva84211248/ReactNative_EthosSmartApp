interface LoginDetails {
    Login_ID: bigint,
    Employee_ID: bigint,
    Sub_Territory_ID: bigint,
    Division_ID: bigint,
    Division_Name: string,
    Designation_ID: bigint,
    Designation_Name: string,
    Employee_Name: string,
    EmployeeName: string,
    HeadQuarter_Name: string,
    Username: string,
    Password: string,
    Authentication: bigint,
    Authentication_Name: string,
    Sub_Territory_Name: string,
    Email: string,
    Mobile: string,
    Employee_Code: string,
    Segment: string,
    Total_MSl_Count: bigint,
    Profile_Image: string
}

interface EmployeeOutput {
    Authentication_ID: number
    Designation_ID: number
    Designation_Name: number
    Division_ID: number
    Division_Name: string
    Email: string
    EmployeeName: string
    Employee_Code: string
    Employee_ID: number
    Employee_Name: string
    Login_ID: number
    Mobile: number
    Reporting_Employee_ID: number
    Segment: string
    Sub_Territory_ID: number
    Sub_Territory_Name: string
    Total_MSl_Count: number
    toggleCheckBox: boolean
}

interface ModelMultiSelection {
    id: number,
    name: string,
    subteritoryId: number,
    languageId: number
    selected: number
    selectedLanguage: boolean,
    flag: string
}

interface ProductLanguage {
    languageId: number
    languageName: string
    selected: number
    selectedLanguage: boolean
}

interface ModalViewProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (selectedItems: ModelMultiSelection[]) => void;
    data: Array<ModelMultiSelection>;
    resetCheckboxState: boolean;
}

interface MSLDetailsinterface {
    id: number;
    Employee_ID: string;
    Employee_Name: string;
    Sub_Territory_ID: string;
    Sub_Territory_Name: string;
    Reporting_Employee_ID: string;
    Reporting_Employee_Name: string;
    Designation_ID: string;
    Designation_Name: string;
    MSL_Type_ID: string;
    MSL_Type_Name: string;
    MSL_ID: string;
    MSL_Name: string;
    MSL_Display_Name: string;
    MSL_Number: string;
    MSL_Contact_Person_Name: string;
    MSL_Segment: string;
    MSL_Basic_Type: string;
    Gender: string;
    Gender_Name: string;
    Speciality_ID: string;
    Speciality_Name: string;
    Qualification_ID1: string;
    Qualification_Name1: string;
    Qualification_ID2: string;
    Qualification_Name2: string;
    Qualification_ID3: string;
    Qualification_Name3: string;
    Registration_Number: string;
    Address: string;
    Pincode: string;
    Phone: string;
    Mobile: string;
    Email: string;
    DOB: string;
    DOW: string;
    Drug_License_No: string;
    VAT_No: string;
    PAN: string;
    PAN_Proof: string;
    AADHAAR: string;
    AADHAAR_Proof: string;
    GSTIN: string;
    GSTIN_Proof: string;
    MSL_Proof: string;
    Latitude: string;
    Longitude: string;
    Market_Area_ID: string;
    Market_Area_Name: string;
    Route_ID: string;
    Route_Name: string;
    Category_ID: string;
    Category_Name: string;
    State_ID: string;
    State_Name: string;
    City_ID: string;
    City_Name: string;
    TP_Selected: string;
    MSL_Updated_Flag: string;
    MSL_KYC_Flag: string;
    Show_MSL: string;
    MSL_VC_Flag: string;
    MSL_Promo_Amount: string;
    Scientific_Registration_Auth: number;
    MSL_Pending_Request: number;
    MSL_ProductGroup_ID: string;
    SelectedDoctorPlanDetainTabVisibility: boolean
}

interface MSlMasterValueInterface {
    id: number,
    Manual_Edetailing: number,
    MSLType: string,
    MSLsurvey: number,
    KYP_Compitator_Brand: number,
    MSLCheck: number,
    MSLPromoLimitVerify: number,
    MSLTypeId: number,
    Print: string,
    FWCampaign_Toggle: number,
    Sample: string,
    BrandReminder: string,
    kyc: number,
    MSLPromoLimit: number,
    Edetailing_Flag: number,
    Campaign_Product: number,
    MSL_Kol_Scientific: number,
    Edetailing_Product_Group_toggle: number,
    Scientific_Registration_flag: number
}

interface DropdownSingleSelect {
    id: number,
    name: string,
}

interface DropDownProps {
    onpress: ((selectedItems: DropdownSingleSelect) => void);
    data: Array<DropdownSingleSelect>
}

interface uniqueProductOutPutList {
    Division_ID: number,
    ProductGroup_ID: number,
    ProductGroup_Name: string,
    ZipFilePath: Array<IZipfilePath>,
    specialityOrderByList:Array<IspecialityOrderByList>,
    fileExist:boolean
}

interface IZipfilePath {
    EdetailingLanguageId:number,
    LanguageName:string,
    Link:string,
    fileExist:boolean
}

interface IspecialityOrderByList{
    IsShow: boolean,
    Speciality_ID: number,
    Speciality_Name: string,
    IsAutoSelect: number,
    OrderBy: number
}

interface UniqueProductFileOutput{
    plannedNumber: number,
    ProductGroup_ID: number,
    ProductFile_ID: number,
    ProductFile_NAME: string,
    ProductFile_ImageNAME: string,
    ProductFile_ImageURL: string,
    ProductFile_New_YesorNo: boolean,
    ProductFile_Mandatory: boolean,
    ProductFile_OrderBy: number,
    ProductGroup_Name: string,
    EdetailingLanguageId: number,
    IsShow: boolean,
    ProductFile_Cover_Image: string,
    IsAutoSelect: number,
    ProductFile_ImageURL_localPath: string,
    fileExist: boolean,
    fileSize: number
}

export type {
    LoginDetails,
    EmployeeOutput,
    ModelMultiSelection,
    ProductLanguage,
    ModalViewProps,
    MSLDetailsinterface,
    MSlMasterValueInterface,
    DropDownProps,
    DropdownSingleSelect,
    uniqueProductOutPutList,
    IspecialityOrderByList,
    IZipfilePath,
    UniqueProductFileOutput
}