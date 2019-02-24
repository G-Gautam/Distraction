const url = "http://localhost:8080/";
function pdfTest() {
    data = {
        type: "online",
        fileUri: "http://ssmengg.edu.in/weos/weos/upload/EStudyMaterial/Cse/6th%20sem/Operating%20system/operating%20system.pdf"
    }
    fetch(url + "pdfOnline", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        return response;
    }).then(function (data) {
    });
}