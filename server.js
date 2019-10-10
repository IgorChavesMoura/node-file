const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const mv = require('mv');

const { IncomingForm } = require('formidable');

const app = express();

app.use(cors()); //Muito provavelmente essa linha é essencial, pq lidando com arquivos o cors gosta de encher o saco


app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname + '/web/index.html'));

});

app.get('/file', (req, res) => {

    let fileName = "hello.txt";
    let filePath = path.join(__dirname + `/file_repo/${fileName}`);

    res.download(filePath, fileName, (err) => { //Aqui tu passa o fileName também pq tu pode mandar o arquivo por download com nome diferente do arquivo original

        if (err) throw err;

        console.log('File downloaded');

    });

});

app.post('/upload', (req, res) => {

    let form = new IncomingForm();

    let user = "zedofrango"; //Login ou id, botei so pra exemplificar uma boa maneira se armazenar os arquivos

    let userDir = path.join(__dirname + `/file_repo/${user}/`);

    //IMPORTANTE, tem que verificar se o diretório que tu vai salvar o arquivo existe, senão existir ele dá erro na hora de mover
    if(!fs.existsSync(userDir)){

        fs.mkdirSync(userDir);

    }

    form.parse(req, (err, fields, files) => {

        let fileName = files.filetoupload.name;
        let fileMimeType = mime.getType()

        

        let oldpath = files.filetoupload.path;
        let newpath = path.join(__dirname + `/file_repo/${user}/` + fileName);
        
        mv(oldpath, newpath, function (err) {
            
            if (err) throw err;
            
            console.log(`File uploaded to ${newpath}`);
            let fileName = files.filetoupload.name;
            let fileMimeType = mime.getType(newpath);
            let fileSize = fs.statSync(newpath).size;

            //Metadados úteis do arquivo que podem ser salvos no BD para fácil acesso
            console.log(`File Path: ${newpath}`); //Sempre salvar esse carinha no banco para recuperar o arquivo no disco. Nunca salve o blob direto no banco, senão vc merece uma pea
            console.log(`File Name: ${fileName}`);    
            console.log(`File Type: ${fileMimeType}`);
            console.log(`File Size: ${fileSize} bytes`); //Útil para controle de utilização de armazenamento

            res.send('Arquivo subido zé!');

            
        });

    });

});

const PORT = 3000

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});

