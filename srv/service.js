const cds = require("@sap/cds")
const { getFolderDetails, getDocument } = require('./utils/handleDMSRequest')
module.exports = cds.service.impl(async function () {
    this.on('getFolderDetails', async (req) => {
        // console.log(req)
        const { folderName } = req.data
        var foldername = await getFolderDetails(folderName)
        console.log(foldername.data)
        return foldername.data
    })
    this.on('getDocument', async (req) => {
        const { objectId } = req.data
        var doc = await getDocument(objectId)
        // console.log(doc)
        return {
            "doc": doc
        }
    })
})
