import { open, NitroSQLite, SQLiteItem } from "react-native-nitro-sqlite";
import { MSLDetailsinterface, UniqueProductFileOutput } from "../components/interfaces";
class dbServices {

}
const db = open({ name: 'Ethos.db', location: 'default' });
const dataBase = NitroSQLite.transaction;
let dataBaseName = "Ethos.db";
const createDatabaseTables = () => {
    db.transaction(tx => {
        console.log("Create Tables Function called");
        tx.executeAsync("CREATE TABLE IF NOT EXISTS Login_Output_Details (id INTEGER PRIMARY KEY AUTOINCREMENT, Login_ID INTEGER, Employee_ID INTEGER, Sub_Territory_ID INTEGER, Division_ID INTEGER, Division_Name TEXT, Designation_ID INTEGER, Designation_Name TEXT, Employee_Name TEXT, EmployeeName TEXT, HeadQuarter_Name TEXT, Username TEXT, Password TEXT, Authentication INTEGER, Authentication_Name TEXT, Sub_Territory_Name TEXT, Email TEXT, Mobile TEXT, Employee_Code TEXT, Segment TEXT, Total_MSl_Count INTEGER, Profile_Image TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS Rep_Own_Sync_Details (id INTEGER PRIMARY KEY AUTOINCREMENT, Kol_Event_Name_output TEXT, campaignoutput TEXT, category_output TEXT, division_output TEXT, emp_output TEXT, kol_category_output TEXT, kol_qualification_output TEXT, kol_scientific_topic_output TEXT, kol_speaker_output TEXT, kol_speciality_output TEXT, kypproductlist TEXT, market_area_output TEXT, master_output TEXT, mode_output TEXT, msloutput TEXT, npd_Feedback_Json TEXT, product_Language_output TEXT, promo_output TEXT, sfc_route_output TEXT, survey_city_output TEXT, survey_competitorbrand_output TEXT, survey_productbrand_output TEXT, survey_qualification1_output TEXT, survey_qualification2_output TEXT, survey_state_output TEXT, surveyspeciality_output TEXT, work_with_output TEXT)", []);
        tx.executeAsync("Create TABLE IF NOT EXISTS Report_Invoice_Datails (id INTEGER PRIMARY KEY AUTOINCREMENT, activity_output TEXT, activity_period_output TEXT, date_output TEXT, kolEventList_Output TEXT, tp_output TEXT)", []);
        tx.executeAsync("Create TABLE IF NOT EXISTS Edetail_Product_details (id INTEGER PRIMARY KEY AUTOINCREMENT, product_output TEXT, productfile_output TEXT, scientificfile_output TEXT,unique_Product_output TEXT, unique_ProductFile_output TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS Msl_Master_Output_Details (id INTEGER PRIMARY KEY AUTOINCREMENT, MSLTypeId INTEGER, MSLType TEXT, MSLCheck INTEGER, kyc INTEGER, MSLsurvey INTEGER, FWCampaign_Toggle INTEGER, Sample TEXT, Print TEXT, BrandReminder TEXT, MSLPromoLimitVerify INTEGER, MSLPromoLimit INTEGER, Edetailing_Flag INTEGER, KYP_Compitator_Brand INTEGER, Campaign_Product INTEGER, Manual_Edetailing INTEGER, MSL_Kol_Scientific INTEGER, Scientific_Registration_flag INTEGER, Edetailing_Product_Group_toggle INTEGER)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS final_screen_details (id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT, employeeid INTEGER, screen TEXT,date TEXT,period INTEGER, periodname TEXT,activity INTEGER,activityname TEXT, category INTEGER, categoryname TEXT,mode INTEGER,modename TEXT, sfc INTEGER, sfcname TEXT, market INTEGER, marketname TEXT, workedWith TEXT, workedWithname TEXT, teamid TEXT, teamname TEXT, MSL_Type_ID INTEGER,  MSL_Type_Name TEXT, MSL_ID INTEGER, MSL_Name TEXT, UnlistedMSLName TEXT, POB_Value INTEGER, tpDeviation TEXT,remarks TEXT, lati REAL, longi REAL, totalstock INTEGER, totalfare INTEGER,prINTEGER_inputs TEXT, brand_reminder TEXT,samples_unit TEXT,average_prescription_permonth INTEGER,kypcampaignproduct TEXT, cdate TEXT, Speciality_ID INTEGER, Campaign_YESNO INTEGER, RTM_CME INTEGER)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS RTM_CME_final_screen_details (id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT, employeeid INTEGER, screen TEXT,date TEXT,period INTEGER, periodname TEXT,activity INTEGER,activityname TEXT, category INTEGER, categoryname TEXT,mode INTEGER,modename TEXT, sfc INTEGER, sfcname TEXT,EventTopicID INTEGER,EventTopicName TEXT, tpDeviation TEXT,remarks TEXT, lati REAL, longi REAL, cdate TEXT, RTM_CME INTEGER)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS campaign_details (id INTEGER PRIMARY KEY AUTOINCREMENT,employeeid INTEGER,screen TEXT, Campaign_ID INTEGER, Campaign_Name TEXT, Campaign_Attendees INTEGER, MSL_Type_ID INTEGER,  MSL_Type_Name TEXT, Campaign_MSL_ID  TEXT, Campaign_Photo TEXT, prINTEGER_inputs TEXT, brand_reminder TEXT,samples_unit TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS screen5_details (id INTEGER PRIMARY KEY AUTOINCREMENT,employeeid INTEGER, selectedmarketid TEXT, selectedmarketname TEXT,venuename TEXT, fromvenuetime TEXT,tovenuetime TEXT,venuephoto TEXT,mslinvited INTEGER,msltypeid INTEGER,msltypename TEXT,selectedmslid TEXT,mslattended INTEGER,nonmslattended INTEGER,totalmslattended INTEGER,costofmeeting TEXT,speakername TEXT,existspeakerid TEXT,existspeakername TEXT,speakerphoto TEXT,brandphoto TEXT,delegatesphoto TEXT,scientificsessionon TEXT,scientificphoto TEXT,acitivitiesphoto TEXT, prINTEGER_inputs TEXT, brand_reminder TEXT,samples_unit TEXT,remarks TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS ETHOS_TriggerDetails(id INTEGER PRIMARY KEY AUTOINCREMENT,Purpose TEXT, cday INTEGER,cmonth INTEGER,cyear INTEGER)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS ETHOS_userinformation(id INTEGER PRIMARY KEY AUTOINCREMENT, Purpose TEXT, information TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS promo_product_info(id INTEGER PRIMARY KEY AUTOINCREMENT, Sub_Territory_ID INTEGER, PromoItem_Dispatched_ID INTEGER, PromoItem_ID INTEGER, PromoItem TEXT, Collaterals TEXT, Collaterals_Code TEXT, Collaterals_Name TEXT, Invoice_NO TEXT, Invoice_Date TEXT, Received_Quantity INTEGER, Invoice_Amount REAL, Promo_Price REAL, Balance_Quantity INTEGER)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS promo_product_MSL_report_info(id INTEGER PRIMARY KEY AUTOINCREMENT, MSL_Type_ID INTEGER,  MSL_Type_Name TEXT, MSL_ID INTEGER, UnlistedMSLName TEXT, Speciality_ID INTEGER, market INTEGER, Employee_ID INTEGER, Sub_Territory_ID INTEGER, PromoItem_Dispatched_ID INTEGER, PromoItem_ID INTEGER, PromoItem TEXT, Invoice_NO TEXT, Invoice_Date TEXT, Promo_Price REAL, given_value INTEGER, MSL_PROMO_AMOUNT REAL, Balance_Quantity INTEGER,Campaign_ID INTEGER)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS MSL_Update_info(id INTEGER PRIMARY KEY AUTOINCREMENT,Employee_ID INTEGER,Sub_Territory_ID INTEGER,MSL_Type_ID INTEGER,MSL_Type_Name TEXT, MSL_ID INTEGER, MSL_Name TEXT, MSL_Contact_Person_Name TEXT,Speciality_ID INTEGER,Speciality_Name TEXT,Gender INTEGER,Gender_Name TEXT,Qualification_ID1 INTEGER,Qualification_Name1 TEXT,Qualification_ID2 INTEGER,Qualification_Name2 TEXT,Qualification_ID3 INTEGER,Qualification_Name3 TEXT,Registration_Number TEXT,Address TEXT,Pincode INTEGER,Phone TEXT,Mobile TEXT,Email TEXT,DOB TEXT,DOW TEXT,Drug_License_No TEXT,VAT_No TEXT,PAN TEXT,PAN_Proof TEXT,AADHAAR TEXT,AADHAAR_Proof TEXT,GSTIN TEXT, GSTIN_Proof TEXT, MSL_Proof TEXT,lati REAL,longi REAL,cdate TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS MSL_surveyupdate_info(id INTEGER PRIMARY KEY AUTOINCREMENT,Employee_ID INTEGER,Sub_Territory_ID INTEGER,MSL_Type_ID INTEGER,MSL_Type_Name TEXT, MSL_ID INTEGER, MSL_Name TEXT, MSL_Number INTEGER,MSL_Brand TEXT,Gender INTEGER,Gender_Name TEXT,Registration_Number TEXT,Qualification_ID1 INTEGER,Qualification_Name1 TEXT,Qualification_ID2 INTEGER,Qualification_Name2 TEXT,Speciality_ID INTEGER,Speciality_Name TEXT,State_ID INTEGER,State_Name TEXT,Market_Area_ID INTEGER,Market_Area_Name TEXT,Address TEXT,City_ID INTEGER,City_Name TEXT,Pincode INTEGER,Mobile TEXT,Email TEXT,DOB TEXT,Dispensing_Doctor INTEGER,Current_businesspermonth INTEGER,Propensity_of_businesspermonth INTEGER,Product_ID INTEGER,Product_Name TEXT,Current_prescription INTEGER,Propensity_to_prescribe INTEGER,Competitor_Brand1 TEXT,Avg_Prescriptionperweek_brand1 INTEGER,Competitor_Brand2 TEXT,Avg_Prescriptionperweek_brand2 INTEGER,Product_ID2 INTEGER,Product_Name2 TEXT,Product_ID3 INTEGER,Product_Name3 TEXT,Other_Products_ID TEXT,Other_Products_NAME TEXT,lati REAL,longi REAL,cdate TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS MSL_surveyupdate_mgrDetails(id INTEGER PRIMARY KEY AUTOINCREMENT,Employee_ID INTEGER,Sub_Territory_ID INTEGER, Old_MSL_ID INTEGER, New_MSL_ID INTEGER, Doctor_ID INTEGER, New_MSL_Number INTEGER, Survey_IsRejected, Survey_IsApproved,Survey_Remarks TEXT, MSL_Number_IsRejected INTEGER, MSL_Number_IsApproved INTEGER, MSL_Number_Remarks TEXT,  cdate TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS edetail_ProductandFile_Table(id INTEGER PRIMARY KEY AUTOINCREMENT, Product_Data JSON, ProductFile_Data JSON, cdate TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS MSL_Planned_ProductFile(id INTEGER PRIMARY KEY AUTOINCREMENT, ProductGroup_ID INTEGER, ProductFile_ID INTEGER, MSL_Type_ID INTEGER,  MSL_Type_Name TEXT, MSL_ID INTEGER, UnlistedMSLName TEXT, Speciality_ID INTEGER,Marketarea_Id INTEGER,  Manual_YesorNo INTEGER, ProductFile_Mandatory INTEGER, ActionType TEXT, cdate TEXT, ProductFile_OrderBy INTEGER, ProductFile_ImageURL_localsmall TEXT, ProductFile_ImageURL_local TEXT, FileExist TEXT,EdetailingLanguageId INTEGER)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS MSL_Product_Edetailed(id INTEGER PRIMARY KEY AUTOINCREMENT, MSL_Type_ID INTEGER,  MSL_Type_Name TEXT, MSL_ID INTEGER, UnlistedMSLName TEXT, Speciality_ID INTEGER,Marketarea_Id INTEGER, ProductTrack_Details TEXT, cdate TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS MSL_Training_Planned_ProductFile(id INTEGER PRIMARY KEY AUTOINCREMENT, ProductGroup_ID INTEGER, ProductFile_ID INTEGER, MSL_Type_ID INTEGER,  MSL_Type_Name TEXT, MSL_ID INTEGER, UnlistedMSLName TEXT, Speciality_ID INTEGER,Marketarea_Id INTEGER,  Manual_YesorNo INTEGER, ProductFile_Mandatory INTEGER, ActionType TEXT, cdate TEXT, ProductFile_OrderBy INTEGER, ProductFile_ImageURL_localsmall TEXT, ProductFile_ImageURL_local TEXT, FileExist TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS gift_OTP_info(id INTEGER PRIMARY KEY AUTOINCREMENT, Employee_ID INTEGER, Sub_Territory_ID INTEGER, MSL_Type_ID INTEGER,  MSL_Type_Name TEXT, MSL_ID INTEGER, MSL_Number INTEGER, OTPval TEXT, Activeval INTEGER, cday INTEGER,cmonth INTEGER,cyear INTEGER, cdate TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS verify_Manch_info(id INTEGER PRIMARY KEY AUTOINCREMENT, Employee_ID INTEGER, Sub_Territory_ID INTEGER, MSL_Type_ID INTEGER,  MSL_Type_Name TEXT, MSL_ID INTEGER, URL TEXT, Activeval INTEGER, cdate TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS verify_BusinessCard_ManchInfo(id INTEGER PRIMARY KEY AUTOINCREMENT, Employee_ID INTEGER, Sub_Territory_ID INTEGER, MSL_Type_ID INTEGER,  MSL_Type_Name TEXT, MSL_ID INTEGER, URL TEXT, Activeval INTEGER, cdate TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS NPD_Feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, Dynamic_Form_Master_ID INTEGER, NPD_Division_Product_Campaign_Mapping_ID INTEGER, MSL_Type_ID INTEGER, Employee_ID INTEGER, Sub_Territory_ID INTEGER, MSL_ID INTEGER, Product_ID INTEGER, Specility_ID INTEGER, Product_Feedback TEXT,MSL_Name TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS Scientific_Publication_Merge(id INTEGER PRIMARY KEY AUTOINCREMENT, Employee_ID INTEGER, Sub_Territory_ID INTEGER, MSL_Employee_ID INTEGER, MSL_Sub_Territory_ID INTEGER, Division_ID INTEGER, MSL_Type_ID TEXT, MSL_Type_Name TEXT, MSL_ID TEXT, MSL_Name TEXT,MSL_Display_Name TEXT, MSL_Email TEXT, MSL_Mobile TEXT, SCIPUB_Email TEXT, SCIPUB_Mobile TEXT, Speciality_ID TEXT,Speciality_Name TEXT, Marketarea_Id TEXT,Market_Area_Name Text, ProductTrack_Details Text, onboarding_Choise TEXT, cdate TEXT)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS Customer_MAnagement(id INTEGER PRIMARY KEY AUTOINCREMENT, Employee_ID INTEGER, Sub_Territory_ID INTEGER, Division_ID INTEGER, MSL_Type_ID TEXT, MSL_ID TEXT, MSL_Name Text,MSL_Number INTEGER,ProductGroup_ID INTEGER, actionType INTEGER, msl_json TEXT, status TEXT,count INTEGER)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS Product_File_Table(id INTEGER PRIMARY KEY AUTOINCREMENT, Division_ID INTEGER, ProductGroup_ID  INTEGER, ProductFile_ID  INTEGER, ProductFile_NAME TEXT, ProductFile_ImageNAME TEXT, ProductFile_ImageURL TEXT, ProductFile_New_YesorNo TEXT, ProductFile_Mandatory TEXT, ProductFile_OrderBy  INTEGER, ProductGroup_Name TEXT, ProductFile_Extension TEXT, ProductFile_ImageURL_local TEXT, ProductFile_ImageURL_localsmall TEXT, EdetailingLanguageId  INTEGER, FileExist TEXT, FileSize TEXT, active INTEGER, FolderName INTEGER)", []);
        tx.executeAsync("CREATE TABLE IF NOT EXISTS E_detail_StartTime_EndTime(id INTEGER PRIMARY KEY AUTOINCREMENT, Employee_ID INTEGER, Sub_Territory_ID INTEGER, Division_ID INTEGER, MSL_Type_ID TEXT, MSL_ID TEXT, MSL_Number INTEGER, Start_Time Text, End_Time Text)", []);
    })
}

const Insert_Login_Output_Details = (data: any) => {
    console.log("DB insert Data", data);
    dataBase(dataBaseName, (tx) => {
        tx.executeAsync("DELETE FROM Login_Output_Details;");
        tx.executeAsync(`
            INSERT INTO Login_Output_Details
            (Login_ID, Employee_ID, Sub_Territory_ID, Division_ID, Division_Name, Designation_ID, Designation_Name, Employee_Name, EmployeeName, HeadQuarter_Name, Username, Password, Authentication, Authentication_Name, Sub_Territory_Name, Email, Mobile, Employee_Code, Segment, Total_MSl_Count, Profile_Image)
            VALUES
            (${Number(data.Login_ID)}, ${Number(data.Employee_ID)}, ${Number(data.Sub_Territory_ID)}, ${Number(data.Division_ID)}, '${data.Division_Name}', ${Number(data.Designation_ID)}, '${data.Designation_Name}', '${data.Employee_Name}', '${data.EmployeeName}', '${data.HeadQuarter_Name}', '${data.Username}', '${data.Password}', ${Number(data.Authentication)}, '${data.Authentication_Name}', '${data.Sub_Territory_Name}', '${data.Email}', '${data.Mobile}', '${data.Employee_Code}', '${data.Segment}', ${Number(data.Total_MSl_Count)}, '${data.Profile_Image}');
        `);
    });
}

const convertBigIntToNumber = (data: any): any => {
    if (Array.isArray(data)) {
        console.log("entered");
        return data.map(item => convertBigIntToNumber(item));
    }
    if (typeof data === 'object' && data !== null) {
        console.log("entered");
        const converted: Record<string, any> = {};
        Object.keys(data).forEach(key => {
            converted[key] = (typeof data[key] === 'bigint') ? Number(data[key]) : data[key];
        });
        return converted;
    }
    return data;
};

const Get_Login_Output_Details = async (): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
        dataBase(dataBaseName, (tx) => {
            tx.executeAsync('SELECT * FROM Login_Output_Details;', []).then(({ rows }) => {
                if (rows && rows._array) {
                    const convertedRows = convertBigIntToNumber(rows._array);
                    resolve(convertedRows);
                } else {
                    resolve([]);
                }
            })
                .catch((error) => {
                    reject(error);
                });
        });
    });
};



const Insert_Msl_Master_Output_Details = (data: any) => {
    dataBase(dataBaseName, (tx) => {
        console.log("Msl_Master_Output_Details", data);

        tx.executeAsync("DELETE from Msl_Master_Output_Details");
        if (data.length === 1) {
            tx.executeAsync(`
                INSERT INTO  Msl_Master_Output_Details
                (MSLTypeId, MSLType, MSLCheck, kyc, MSLsurvey, FWCampaign_Toggle, Sample, Print, BrandReminder, MSLPromoLimitVerify, MSLPromoLimit, Edetailing_Flag, KYP_Compitator_Brand, Campaign_Product, Manual_Edetailing, MSL_Kol_Scientific, Scientific_Registration_flag, Edetailing_Product_Group_toggle)
                VALUES (${Number(data[0].MSLTypeId)}, '${data[0].MSLType}', ${Number(data[0].MSLCheck)}, ${Number(data[0].kyc)}, ${Number(data[0].MSLsurvey)}, ${Number(data[0].FWCampaign_Toggle)}, '${data[0].Sample}', '${data[0].Print}', '${data[0].BrandReminder}', ${Number(data[0].MSLPromoLimitVerify)}, ${Number(data[0].MSLPromoLimit)}, ${Number(data[0].Edetailing_Flag)}, ${Number(data[0].KYP_Compitator_Brand)}, ${Number(data[0].Campaign_Product)}, ${Number(data[0].Manual_Edetailing)}, ${Number(data[0].MSL_Kol_Scientific)}, ${Number(data[0].Scientific_Registration_flag)}, ${Number(data[0].Edetailing_Product_Group_toggle)});
            `);
        } else {
            data.forEach((ele: { MSLTypeId: any; MSLType: any; MSLCheck: any; kyc: any; MSLsurvey: any; FWCampaign_Toggle: any; Sample: any; Print: any; BrandReminder: any; MSLPromoLimitVerify: any; MSLPromoLimit: any; Edetailing_Flag: any; KYP_Compitator_Brand: any; Campaign_Product: any; Manual_Edetailing: any; MSL_Kol_Scientific: any; Scientific_Registration_flag: any; Edetailing_Product_Group_toggle: any; }) => {
                tx.executeAsync(`
                    INSERT INTO Msl_Master_Output_Details
                    (MSLTypeId, MSLType, MSLCheck, kyc, MSLsurvey, FWCampaign_Toggle, Sample, Print, BrandReminder, MSLPromoLimitVerify, MSLPromoLimit, Edetailing_Flag, KYP_Compitator_Brand, Campaign_Product, Manual_Edetailing, MSL_Kol_Scientific, Scientific_Registration_flag, Edetailing_Product_Group_toggle)
                    VALUES (${Number(ele.MSLTypeId)}, '${ele.MSLType}', ${Number(ele.MSLCheck)}, ${Number(ele.kyc)}, ${Number(ele.MSLsurvey)}, ${Number(ele.FWCampaign_Toggle)}, '${ele.Sample}', '${ele.Print}', '${ele.BrandReminder}', ${Number(ele.MSLPromoLimitVerify)}, ${Number(ele.MSLPromoLimit)}, ${Number(ele.Edetailing_Flag)}, ${Number(ele.KYP_Compitator_Brand)}, ${Number(ele.Campaign_Product)}, ${Number(ele.Manual_Edetailing)}, ${Number(ele.MSL_Kol_Scientific)}, ${Number(ele.Scientific_Registration_flag)}, ${Number(ele.Edetailing_Product_Group_toggle)});
                `);
            });
        }

    })
}

const Get_Msl_Master_Output_Details = async () => {
    return new Promise<any[]>((resolve, reject) => {
        dataBase(dataBaseName, (tx) => {
            tx.executeAsync('SELECT * FROM Msl_Master_Output_Details;', [])
                .then(({ rows }) => {
                    if (rows && rows._array) {
                        const convertedRows = convertBigIntToNumber(rows._array);
                        resolve(convertedRows);
                    } else {
                        resolve([]);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    });
};

const Insert_GetReport_Output_Details = (data: any) => {
    dataBase(dataBaseName, (tx) => {
        console.log("Report_Invoice_Datails", data);
        tx.executeAsync("DELETE from Report_Invoice_Datails");
        tx.executeAsync(`
                INSERT INTO Report_Invoice_Datails(activity_output, activity_period_output, date_output, kolEventList_Output, tp_output)
                VALUES (${JSON.stringify(data.activity_output)},${JSON.stringify(data.activity_period_output)}, ${JSON.stringify(data.date_output)}, ${JSON.stringify(data.kolEventList_Output)}, ${JSON.stringify(data.tp_output)});
            `);
    })
}

const InsertGetRepOwnSyncDetails = (data: any) => {
    const stringifyValue = (value: any) => {
        if (value === null || value === undefined) {
            return 'NULL';
        }
        if (typeof value === 'string') {
            return `'${value.replace(/'/g, "''")}'`;
        }
        return JSON.stringify(value);
    };

    try {
        dataBase(dataBaseName, async (tx) => {
            try {
                await tx.executeAsync("DELETE from Rep_Own_Sync_Details");
                const values = [
                    "Kol_Event_Name_output", "campaignoutput", "category_output", "division_output", "emp_output",
                    "kol_category_output", "kol_qualification_output", "kol_scientific_topic_output", "kol_speaker_output",
                    "kol_speciality_output", "kypproductlist", "market_area_output", "master_output", "mode_output",
                    "msloutput", "npd_Feedback_Json", "product_Language_output", "promo_output", "sfc_route_output",
                    "survey_city_output", "survey_competitorbrand_output", "survey_productbrand_output",
                    "survey_qualification1_output", "survey_qualification2_output", "survey_state_output",
                    "surveyspeciality_output", "work_with_output"
                ];
                const mappedValues = values.map(field => stringifyValue(data[field]));
                console.log("mappedValues", mappedValues);

                const query = `
                    INSERT INTO Rep_Own_Sync_Details(${values.join(', ')})
                    VALUES (${mappedValues.join(', ')});
                `;
                await tx.executeAsync(query);
            } catch (error) {
                console.log("Error executing SQL:", error);
            }
        });
    } catch (error) {
        console.log("Unexpected error:", error);
    }
};

const GetRepSyncColumnDetails = (columnName: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        dataBase(dataBaseName, (tx) => {
            tx.executeAsync(`SELECT ${columnName} FROM Rep_Own_Sync_Details`, [])
                .then(({ rows }) => {
                    if (rows && rows._array) {
                        resolve((rows._array[0]));
                    } else {
                        resolve([]);
                    }
                })
                .catch(reject);
        });
    });
};

const updateRepSyncColumDetails = (updateColumnName: string, UpdateColumnDetails: any) => {
    try {
        dataBase(dataBaseName, async (tx) => {
            await tx.executeAsync(`UPDATE Rep_Own_Sync_Details SET ${updateColumnName} = ?`, [UpdateColumnDetails]);
        });
    } catch (error) {
        console.log('Error updating column:', error);
    }
};


const Insert_Product_Details = (data: any): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        dataBase(dataBaseName, (tx) => {
            tx.executeAsync("DELETE FROM Edetail_Product_details").then(() => {
                const query = `
              INSERT INTO Edetail_Product_details (product_output, productfile_output, scientificfile_output)
              VALUES (?, ?, ?);
            `;
                return tx.executeAsync(query, [data.product_output, data.productfile_output, data.scientificfile_output]);
            })
                .then(() => {
                    resolve("Edetail_Product_details inserted successfully.");
                })
                .catch((error) => {
                    reject("Error while inserting Edetail_Product_details");
                    console.error("Error during DELETE or INSERT operation:", error);
                });
        })
            .catch((error) => {
                console.error("Error opening the database or transaction:", error);
                reject("Error opening the database.");
            });
    });
};

const GetProductDetails = (columnName: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        dataBase(dataBaseName, (tx) => {
            tx.executeAsync(`SELECT ${columnName} FROM Edetail_Product_details`, [])
                .then(({ rows }) => {
                    console.log(rows);

                    if (rows && rows._array) {
                        resolve((rows._array[0]));
                    } else {
                        resolve([]);
                    }
                })
                .catch(reject);
        });
    });
};

const updateUniqueProductList = (updateColumnName: string, UpdateColumnDetails: any) => {
    try {
        dataBase(dataBaseName, async (tx) => {
            const UpdateColumnDetailsStr = JSON.stringify(UpdateColumnDetails);
            await tx.executeAsync(`UPDATE Edetail_Product_details SET ${updateColumnName} = ?`, [UpdateColumnDetailsStr]).then(() => {
                console.log("Updated successfully");
            })
        });
    } catch (error) {
        console.log('Error updating column:', error);
    }
};



const Insert_MSLPlannedproduct_Details = async (ProductGroup_ID: number, ProductFile_ID: number, Manual_YesorNo: number, ProductFile_Mandatory: number, UnlistedMSLName: string, Speciality_ID: number, Marketarea_Id: number, EdetailingLanguageId: number, selectedMSLDetails: MSLDetailsinterface): Promise<any> => {
    const getUniqueProductFileoutput = await GetProductDetails("unique_ProductFile_output");
    dataBase(dataBaseName, async (tx) => {
        try {
            let cDate: any = new Date();
            var cdateval: any = cDate.getFullYear() + "-" + (cDate.getMonth() + 1) + "-" + cDate.getDate() + " " + cDate.getHours() + ":" + cDate.getMinutes() + ":" + cDate.getSeconds();
            console.log("cdateval", cdateval);
            if (selectedMSLDetails.MSL_ID != undefined && Number(selectedMSLDetails.MSL_ID) > 0) {
                await tx.executeAsync("DELETE FROM MSL_Planned_ProductFile where ProductGroup_ID=? and ProductFile_ID=? and Manual_YesorNo=0 and MSL_Type_ID=? and MSL_ID=?", [ProductGroup_ID, ProductFile_ID, Number(selectedMSLDetails.MSL_Type_ID), Number(selectedMSLDetails.MSL_ID)]);
            } else {
                await tx.executeAsync("DELETE FROM MSL_Planned_ProductFile where ProductGroup_ID=? and ProductFile_ID=? and Manual_YesorNo=0 and MSL_Type_ID=? and UnlistedMSLName=? and Speciality_ID=? and Marketarea_Id=?", [ProductGroup_ID, ProductFile_ID, Number(selectedMSLDetails.MSL_Type_ID), UnlistedMSLName, Speciality_ID, Marketarea_Id]);
            }
            if (Manual_YesorNo == 1) {
                await tx.executeAsync("INSERT INTO MSL_Planned_ProductFile(ProductGroup_ID, ProductFile_ID, MSL_Type_ID,  MSL_Type_Name, MSL_ID, UnlistedMSLName, Speciality_ID, Marketarea_Id, Manual_YesorNo , ProductFile_Mandatory , ActionType, cdate, ProductFile_OrderBy,ProductFile_ImageURL_localsmall,ProductFile_ImageURL_local,FileExist,EdetailingLanguageId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [ProductGroup_ID, ProductFile_ID, Number(selectedMSLDetails.MSL_Type_ID), selectedMSLDetails.MSL_Type_Name, Number(selectedMSLDetails.MSL_ID), UnlistedMSLName, Speciality_ID, Marketarea_Id, Manual_YesorNo, ProductFile_Mandatory, 'add', cdateval, 0, '', '', false, EdetailingLanguageId]);
            } else {
                const selectproductinfo = JSON.parse(getUniqueProductFileoutput.unique_ProductFile_output).filter((epnospl: any) => epnospl.ProductFile_ID == ProductFile_ID);
                console.log("selectproductinfo", selectproductinfo);
                console.log("Insert_MSLPlannedproduct_Details", ProductGroup_ID, ProductFile_ID, Number(selectedMSLDetails.MSL_Type_ID), selectedMSLDetails.MSL_Type_Name, Number(selectedMSLDetails.MSL_ID), UnlistedMSLName, Speciality_ID, Marketarea_Id, Manual_YesorNo, ProductFile_Mandatory, 'add', cdateval, selectproductinfo[0].ProductFile_OrderBy, "", selectproductinfo[0].ProductFile_ImageURL_localPath, selectproductinfo[0].fileExist, EdetailingLanguageId);
                await tx.executeAsync("INSERT INTO MSL_Planned_ProductFile(ProductGroup_ID, ProductFile_ID, MSL_Type_ID,  MSL_Type_Name, MSL_ID, UnlistedMSLName, Speciality_ID, Marketarea_Id, Manual_YesorNo , ProductFile_Mandatory , ActionType, cdate, ProductFile_OrderBy,ProductFile_ImageURL_localsmall,ProductFile_ImageURL_local,FileExist,EdetailingLanguageId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [ProductGroup_ID, ProductFile_ID, Number(selectedMSLDetails.MSL_Type_ID), selectedMSLDetails.MSL_Type_Name, Number(selectedMSLDetails.MSL_ID), UnlistedMSLName, Speciality_ID, Marketarea_Id, Manual_YesorNo, ProductFile_Mandatory, 'add', cdateval, selectproductinfo[0].ProductFile_OrderBy, "", selectproductinfo[0].ProductFile_ImageURL_localPath, selectproductinfo[0].fileExist, EdetailingLanguageId]);
            }
        } catch (error) {
            console.log(error);
        }
    })
}

const Check_MSLplannedproduct_byGroupId = async (ProductGroup_ID: number, UnlistedMSLName: string, Speciality_ID: number, Marketarea_Id: number, selectedMSLDetails: MSLDetailsinterface): Promise<SQLiteItem[]> => {
    return new Promise((resolve, reject) => {
        dataBase(dataBaseName, (tx) => {
            tx.executeAsync(`SELECT COUNT(*) as count FROM MSL_Planned_ProductFile WHERE ProductGroup_ID=? AND Manual_YesorNo=0 AND MSL_Type_ID=? AND MSL_ID=?`,
                [ProductGroup_ID, Number(selectedMSLDetails.MSL_Type_ID), Number(selectedMSLDetails.MSL_ID)])
                .then(({ rows }) => {
                    console.log(rows);
                    if (rows && rows._array) {
                        const convertedRows = convertBigIntToNumber(rows._array);
                        resolve(convertedRows);
                    } else {
                        resolve([]);
                    }
                })
                .catch(reject);
        });
    });
};

const Check_MSLplannedproduct_byFileId = (ProductFile_ID: number, UnlistedMSLName: string, Speciality_ID: number, Marketarea_Id: number, selectedMSLDetails: MSLDetailsinterface): Promise<SQLiteItem[]> => {
    return new Promise((resolve, reject) => {
        dataBase(dataBaseName, (tx) => {
            let query = "";
            let values = [];
            if (selectedMSLDetails.MSL_ID != undefined && Number(selectedMSLDetails.MSL_ID) > 0) {
                query = "SELECT COUNT(*) as count FROM MSL_Planned_ProductFile where ProductFile_ID=? and ProductFile_Mandatory=1 and MSL_Type_ID=? and MSL_ID=?";
                values = [ProductFile_ID, Number(selectedMSLDetails.MSL_Type_ID), Number(selectedMSLDetails.MSL_ID)]
            } else {
                query = "SELECT COUNT(*) as count FROM MSL_Planned_ProductFile where ProductFile_ID=? and ProductFile_Mandatory=1 and MSL_Type_ID=? and UnlistedMSLName=? and Speciality_ID=? and Marketarea_Id=?";
                values = [ProductFile_ID, Number(selectedMSLDetails.MSL_Type_ID), UnlistedMSLName, Speciality_ID, Marketarea_Id]
            }
            tx.executeAsync(query, values)
                .then(({ rows }) => {
                    console.log(rows);
                    if (rows && rows._array) {
                        const convertedRows = convertBigIntToNumber(rows._array);
                        resolve(convertedRows);
                    } else {
                        resolve([]);
                    }
                })
                .catch(reject);
        });
    });
}

const Check_MSLplannedproduct_NonMandatory_byGroupId = (ProductGroup_ID: number, UnlistedMSLName: string, Speciality_ID: number, Marketarea_Id: number, selectedMSLDetails: MSLDetailsinterface, ProductFile_ID: number): Promise<SQLiteItem[]> => {
    return new Promise((resolve, reject) => {
        dataBase(dataBaseName, (tx) => {
            let query = "";
            let values = [];
            if (selectedMSLDetails.MSL_ID != undefined && Number(selectedMSLDetails.MSL_ID) > 0) {
                query = "SELECT * FROM MSL_Planned_ProductFile where ProductGroup_ID=? and ProductFile_ID=? and ProductFile_Mandatory=0 and MSL_Type_ID=? and MSL_ID=?";
                values = [ProductGroup_ID, ProductFile_ID, Number(selectedMSLDetails.MSL_Type_ID), Number(selectedMSLDetails.MSL_ID)]
            } else {
                query = "SELECT * FROM MSL_Planned_ProductFile where ProductGroup_ID=? and ProductFile_ID=? and ProductFile_Mandatory=0 and MSL_Type_ID=? and UnlistedMSLName=? and Speciality_ID=? and Marketarea_Id=?";
                values = [ProductGroup_ID, ProductFile_ID, Number(selectedMSLDetails.MSL_Type_ID), UnlistedMSLName, Speciality_ID, Marketarea_Id]
            }
            tx.executeAsync(query, values)
                .then(({ rows }) => {
                    console.log(rows);
                    if (rows && rows._array) {
                        const convertedRows = convertBigIntToNumber(rows._array);
                        resolve(convertedRows);
                    } else {
                        resolve([]);
                    }
                })
                .catch(reject);
        });
    });
}

const Delete_MSLplannedproduct_ByGroupId = (ProductGroup_ID: number, selectedMSLDetails: MSLDetailsinterface): any => {
    dataBase(dataBaseName, (tx) => {
        tx.executeAsync(`DELETE FROM MSL_Planned_ProductFile where ProductGroup_ID=${ProductGroup_ID} and Manual_YesorNo=0 and MSL_Type_ID=${Number(selectedMSLDetails.MSL_Type_ID)} and MSL_ID=${Number(selectedMSLDetails.MSL_ID)}`, []);
    })
}

const Delete_MSLplannedproduct_byFileId = (ProductFile_ID: number, selectedMSLDetails: MSLDetailsinterface): any => {
    dataBase(dataBaseName, (tx) => {
        tx.executeAsync(`DELETE FROM MSL_Planned_ProductFile where ProductFile_ID=${ProductFile_ID} and Manual_YesorNo=0 and MSL_Type_ID=${Number(selectedMSLDetails.MSL_Type_ID)} and MSL_ID=${Number(selectedMSLDetails.MSL_ID)}`, []);
    })
}

const GET_MSLplannedproduct_byMSLID = (UnlistedMSLName: string, Speciality_ID: number, Marketarea_Id: number, EdetailingLanguageId: number, selectedMSLDetails: MSLDetailsinterface) => {
    return new Promise((resolve, reject) => {
        let query = "";
        let values:any = [];
        dataBase(dataBaseName, async (tx) => {
            if (selectedMSLDetails.MSL_ID != undefined && Number(selectedMSLDetails.MSL_ID) > 0) {
                query = "SELECT * FROM MSL_Planned_ProductFile where Manual_YesorNo=0 and MSL_Type_ID=? and MSL_ID=?";
                values = [Number(selectedMSLDetails.MSL_Type_ID), Number(selectedMSLDetails.MSL_ID)];
            }else{
                query = "SELECT * FROM MSL_Planned_ProductFile where Manual_YesorNo=0 and MSL_Type_ID=? and UnlistedMSLName=? and Speciality_ID=? and Marketarea_Id=?";
                values = [Number(selectedMSLDetails.MSL_Type_ID), UnlistedMSLName, Speciality_ID, Marketarea_Id]
            }
            try {
                await tx.executeAsync(query, values).then(({ rows }) => {
                    if (rows && rows._array) {
                        const convertedBigIntvalues = convertBigIntToNumber(rows._array);
                        resolve(convertedBigIntvalues)
                    } else {
                        resolve([])
                    }
                }).catch((error) => {
                    console.log(error);
                })
            } catch (error) {
                console.log(error);
            }
        })
    })
}






export {
    createDatabaseTables,
    Insert_Login_Output_Details,
    Get_Login_Output_Details,
    Insert_Msl_Master_Output_Details,
    Get_Msl_Master_Output_Details,
    Insert_GetReport_Output_Details,
    InsertGetRepOwnSyncDetails,
    GetRepSyncColumnDetails,
    updateRepSyncColumDetails,
    Insert_Product_Details,
    GetProductDetails,
    updateUniqueProductList,
    Check_MSLplannedproduct_byGroupId,
    Insert_MSLPlannedproduct_Details,
    Check_MSLplannedproduct_byFileId,
    Check_MSLplannedproduct_NonMandatory_byGroupId,
    Delete_MSLplannedproduct_ByGroupId,
    Delete_MSLplannedproduct_byFileId,
    GET_MSLplannedproduct_byMSLID
}







