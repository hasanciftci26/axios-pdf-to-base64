const axios = require("axios"),
    fs = require("fs"),
    dotenv = require("dotenv");

dotenv.config();

let clientID = process.env.CLIENT_ID,
    clientSecret = process.env.CLIENT_SECRET,
    tokenURL = process.env.TOKEN_URL,
    pdfURL = process.env.PDF_URL;

async function getToken() {
    let buffer = new Buffer.from(`${clientID}:${clientSecret}`),
        base64data = buffer.toString("base64");

    let token = await axios.post(tokenURL, {
        grant_type: "client_credentials"
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${base64data}`
        }
    });

    return token;
}

async function getPDF(token) {
    let pdfFile = await axios.get(pdfURL, {
        responseType: "arraybuffer",
        responseEncoding: "binary",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return pdfFile.data;
}

getToken().then(async (token) => {
    let pdfFile = await getPDF(token.data.access_token);
    const buffer = Buffer.from(pdfFile, "binary");
    const base64PDF = buffer.toString("base64");

    fs.writeFileSync("audi_row.pdf", base64PDF, {
        encoding: "base64"
    });
});