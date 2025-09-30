const { BlobServiceClient } = require("@azure/storage-blob")
require("dotenv").config()
const { v4: uuidv4 } = require('uuid')

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_CONN
const AZURE_CONTAINER_NAME = process.env.AZURE_CONT

if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error("Azure Storage Connection string is not configured")
}



async function uploadImageToAzureBlob(file) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
    const blobContainer = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME)

    const blobName = `${uuidv4()}-${file.originalname}`
    const blobBlockClient = blobContainer.getBlockBlobClient(blobName)

    await blobBlockClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype}
    })

    return blobBlockClient.url
}

module.exports = {uploadImageToAzureBlob}