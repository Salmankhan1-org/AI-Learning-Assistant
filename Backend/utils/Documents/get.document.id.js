exports.GetDocumentId = (req) => {
    const {documentId} = req.params;

    if(!documentId){
        throw new Error("Document Id is required");
    }

    return documentId;
}