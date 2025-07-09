import conf from '../conf/conf.js';
import { Client, Databases, Storage, Query, ID } from "appwrite";
import { v4 as uuid } from "uuid";
import { getMonthlyLimitSlug, getCurrentYear, getCurrentMonth } from '../utils/utils'

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async addMonthlyLimit({user_id, amount}){
        try {
            const limit_amount = Number(amount);
            const year = getCurrentYear()
            const month = getCurrentMonth()

            const data = await this.databases.createDocument(
                conf.appwriteExpenseTrackerDatabaseId,
                conf.appwriteMonthlyLimitCollectionId,
                getMonthlyLimitSlug(user_id),
                {
                    user_id,
                    limit_amount,
                    year,
                    month
                }
            )

            if(data){
                return {
                    status: true,
                    data: data
                };
            }else{
                return {
                    status: false,
                    data: "Error: Something went wrong. Please try again."
                };
            }
            
        } catch (error) {
            console.log("Appwrite serive :: AddMonthlyLimit :: error", error);
            return {
                status: false,
                data: error
            };
        }
    }

    async updateMonthlyLimit({user_id, amount}){
        try {
            const limit_amount = Number(amount);
            const data = await this.databases.updateDocument(
                conf.appwriteExpenseTrackerDatabaseId,
                conf.appwriteMonthlyLimitCollectionId,
                getMonthlyLimitSlug(user_id),
                {
                    limit_amount
                }
            )

            if(data){
                return {
                    status: true,
                    data: data
                };
            }else{
                return {
                    status: false,
                    data: "Error: Something went wrong. Please try again."
                };
            }
        } catch (error) {
            console.log("Appwrite serive :: updateMonthlyLimit :: error", error);
        }
    }

    async getMonthlyLimit(slug){
        try {
            const data = await this.databases.getDocument(
                conf.appwriteExpenseTrackerDatabaseId,
                conf.appwriteMonthlyLimitCollectionId,
                slug
            )

            if(data){
                return {
                    status: true,
                    data: data
                };
            }else{
                return {
                    status: false,
                    data: "Error: Something went wrong. Please try again."
                };
            }
        } catch (error) {
            console.log("Appwrite serive :: getMonthlyLimit :: error", error);
            return {
                status: false,
                data: error
            };
        }
    }

    async getExpenseById(slug){
        try {
            const data = await this.databases.getDocument(
                conf.appwriteExpenseTrackerDatabaseId,
                conf.appwriteExpenseCollectionId,
                slug
            )

            if(data){
                return {
                    status: true,
                    data: data
                };
            }else{
                return {
                    status: false,
                    data: "Error: Something went wrong. Please try again."
                };
            }
        } catch (error) {
            console.log("Appwrite serive :: getExpenseById :: error", error);
            return {
                status: false,
                data: error
            };
        }
    }

    async getAllCurrentMonthExpenses(user_id){
        try {
            const queries =  [
                Query.equal('user_id', user_id),
                Query.equal('year', getCurrentYear()),
                Query.equal('month', getCurrentMonth())
            ]

            const data = await this.databases.listDocuments(
                conf.appwriteExpenseTrackerDatabaseId,
                conf.appwriteExpenseCollectionId,
                queries,
            )

            if(data){
                return {
                    status: true,
                    data: data
                };
            }else{
                return {
                    status: false,
                    data: "Error: Something went wrong. Please try again."
                };
            }
        } catch (error) {
            console.log("Appwrite serive :: getAllCurrentMonthExpenses :: error", error);
            return {
                status: false,
                data: error
            };
        }
    }

    async getAllExpensesByYear(user_id, year, page=1){
        try {
            const offset = (page - 1) * 5;
            const queries =  [
                Query.equal('user_id', user_id),
                Query.equal('year', year),
                Query.limit(5),
                Query.offset(offset)
            ]

            const data = await this.databases.listDocuments(
                conf.appwriteExpenseTrackerDatabaseId,
                conf.appwriteExpenseCollectionId,
                queries,
            )

            if(data && Object.keys(data).length>0){
                return {
                    status: true,
                    data: data
                };
            }else{
                return {
                    status: false,
                    data: "Error: Something went wrong. Please try again."
                };
            }
        } catch (error) {
            console.log("Appwrite serive :: getAllCurrentMonthExpenses :: error", error);
            return {
                status: false,
                data: error
            };
        }
    }

    async addExpense({user_id, amount, reason, fileId}){
        try {
            amount = Number(amount);
            const year = getCurrentYear()
            const month = getCurrentMonth()
            const data =  await this.databases.createDocument(
                conf.appwriteExpenseTrackerDatabaseId,
                conf.appwriteExpenseCollectionId,
                uuid(),
                {
                    user_id,
                    amount,
                    reason,
                    year,
                    month,
                    fileId
                }
            )

            if(data){
                return {
                    status: true,
                    data: data
                };
            }else{
                return {
                    status: false,
                    data: "Error: Something went wrong. Please try again."
                };
            }
            
        } catch (error) {
            console.log("Appwrite serive :: AddExpense :: error", error);
            return {
                status: false,
                data: error
            };
        }
    }

    async updateExpense({user_id, amount, reason, year, month, fileId, expenseId}){
        try {
            amount = Number(amount);
            const data =  await this.databases.updateDocument(
                conf.appwriteExpenseTrackerDatabaseId,
                conf.appwriteExpenseCollectionId,
                expenseId,
                {
                    user_id,
                    amount,
                    reason,
                    year,
                    month,
                    fileId
                }
            )

            if(data){
                return {
                    status: true,
                    data: data
                };
            }else{
                return {
                    status: false,
                    data: "Error: Something went wrong. Please try again."
                };
            }
            
        } catch (error) {
            console.log("Appwrite serive :: UpdateExpense :: error", error);
            return {
                status: false,
                data: error
            };
        }
    }

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async getUploadedFileById(fileId){
        try {
            return await this.bucket.getFile(
                conf.appwriteBucketId,
                fileId
            )
        } catch (error) {
            console.log("Appwrite serive :: getUploadedFileById :: error", error);
            return false
        }
    }


    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFileDownload(fileId){
        return this.bucket.getFileDownload(
            conf.appwriteBucketId,
            fileId
        )
    }
}


const service = new Service()
export default service