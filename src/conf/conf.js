const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteExpenseTrackerDatabaseId: String(import.meta.env.VITE_APPWRITE_EXPENSE_TRACKER_DATABASE_ID),
    appwriteMonthlyLimitCollectionId: String(import.meta.env.VITE_APPWRITE_MONTHLY_LIMIT_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteExpenseCollectionId: String(import.meta.env.VITE_APPWRITE_EXPENSE_COLLECTION_ID),
}
// there was a name issue with the import.meta.env.VITE_APPWRITE_URL, it was later fixed in debugging video

export default conf