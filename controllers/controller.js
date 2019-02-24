//Simple version, without validation or sanitation
let fs = require('fs');
let PDFParser = require('pdf2json');
let request = require('request');
var htmlToText = require('html-to-text');
var download = require('download-pdf')
const http = require("http")

//Extracts the keywords form the pdf
function keywordPDF(textFile) {

    var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2018-11-16',
        iam_apikey: 'yRfSXqDVeUq7BhOzcOBd_PXQALyKmKyUVmRl3655Gm9e',
        url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
    });

    var parameters = {
        'text': textFile,
        'features': {
            'categories': {
                'limit': 3
            },
            'concepts': {
                'limit': 10
            },
            'keywords': {
                'limit': 10
            }
        }
    };

    list = ""

    naturalLanguageUnderstanding.analyze(parameters, function (err, response) {
        if (err)
            console.log('error:', err);
        else {
            for (i = 0; i < response.keywords.length; i++) {
                list = list + " " + response.keywords[i].text
                list = list + "\n"
                list = list + " " + response.concepts[i].text
                list = list + "\n"
            }
            for (i = 0; i < response.categories.length; i++) {
                list = list + " " + response.categories[i].label.split('/')[3]
                list = list + "\n"
            }
            fs.writeFile('keywordsPDF.txt', list, function (err, result) {
                if (err) return (err);
            })
        }
    })
}


//Reads the file pdf and sends to the function above
function readPDF(fileName) {
    fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) return err;
        return keywordPDF(data);
    });
}


exports.pdfOnline = function (req, res) {
    if (req.body.type == "online") {
        //Deal with url
        const file = fs.createWriteStream("file.pdf");
        const request = http.get(req.body.fileUri, function (response) {
            response.pipe(file);
        })
        file.on('close', function () {
            let pdfParser = new PDFParser(this, 1);
            pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
            pdfParser.on("pdfParser_dataReady", pdfData => {
                fs.writeFile("pdf.txt", pdfParser.getRawTextContent(), function (err, result) {
                    if (err) console.log(err)
                });
            });
            pdfParser.loadPDF('file.pdf');
        })
        readPDF('pdf.txt');
    }
    
    res.send(req.body.fileUri);
};

exports.article = function(req, res){
    var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2018-11-16',
        iam_apikey: 'yRfSXqDVeUq7BhOzcOBd_PXQALyKmKyUVmRl3655Gm9e',
        url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
    });

    var parameters = {
        'url': req.body.url,
        'features': {
            'categories': {
                'limit': 3
            },
            'concepts': {
                'limit': 10
            },
            'keywords': {
                'limit': 10
            }
        }
    };
    list = ""
    naturalLanguageUnderstanding.analyze(parameters, function (err, response) {
        if (err)
            console.log('error:', err);
        else {
            for (i = 0; i < response.keywords.length; i++) {
                list = list + " " + response.keywords[i].text
                list = list + "\n"
                list = list + " " + response.concepts[i].text
                list = list + "\n"
            }
            for (i = 0; i < response.categories.length; i++) {
                list = list + " " + response.categories[i].label.split('/')[3]
                list = list + "\n"
            }

            fs.writeFile('keywordsArticle.txt', list, function (err, result) {
                if (err) return (err);
            })
        }
    })

    res.send("Called")
}
function keywordYTSub(textFile) {

    var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2018-11-16',
        iam_apikey: 'yRfSXqDVeUq7BhOzcOBd_PXQALyKmKyUVmRl3655Gm9e',
        url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
    });

    var parameters = {
        'text': textFile,
        'features': {
            'categories': {
                'limit': 3
            },
            'concepts': {
                'limit': 10
            },
            'keywords': {
                'limit': 10
            }
        }
    };
    list = ""
    naturalLanguageUnderstanding.analyze(parameters, function (err, response) {
        if (err)
            console.log('error:', err);
        else {
            for (i = 0; i < response.keywords.length; i++) {
                list = list + " " + response.keywords[i].text
                list = list + "\n"
                list = list + " " + response.concepts[i].text
                list = list + "\n"
            }
            for (i = 0; i < response.categories.length; i++) {
                list = list + " " + response.categories[i].label.split('/')[3]
                list = list + "\n"
            }

            fs.writeFile('keywordsYTSub.txt', list, function (err, result) {
                if (err) return (err);
            })
        }
    })
}

//Reads the subtitle file and then passes the value to the function which extracts the keywords
function readFile(fileName) {
    fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) return err;
        return keywordYTSub(data);
    });
}

exports.ytSub = function(req, res){
    var getSubtitles = require('youtube-captions-scraper').getSubtitles;
    var newlist = "";

    getSubtitles({
        videoID: req.body.videoId, // youtube video id
        lang: 'en' // default: `en`
    }).then(function (captions) {
        for (i = 0; i < captions.length; i++) {
            newlist = newlist + " " + captions[i]['text']
        }
        fs.writeFile('YoutubeSubtitles.txt', newlist, function (err) {
            if (err) return console.log(err);
            readFile('YoutubeSubtitles.txt');
        });

    });

    res.send('called')
}

exports.ytTag = function(req, res){
    data = ""
    request('https://www.googleapis.com/youtube/v3/videos?key=AIzaSyDH1ZZOZ7ba0uW1TGRlFHZ2szdAI5k1_go&fields=items(snippet(title,description,tags))&part=snippet&id=' + req.body.videoId, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        data = JSON.stringify(body.items[0].snippet.title) + "\n"
        temp = JSON.stringify(body.items[0].snippet.tags).split(",")
        for(i = 0; i < temp.length; i++){
            temp[i] = temp[i].replace("\"", "")
            temp[i] = temp[i].replace("\"", "")
            data = data + temp[i]
            data = data + "\n"
        }
        fs.writeFile("YoutubeTags.txt", data, function (err2, result) {
            if (err2) { return console.log(err) }

        })
    })
}