service DataManagement {
    
    function getFolderDetails(folderName : String) returns String;
    function getDocument(objectId : String)        returns {
        // @Core.MediaType: 'image/png'
        doc : LargeBinary ;

    };
}
