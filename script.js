import { HuffmanCoder } from "./huffmanEncoding.js";

window.onload = function(){
    console.log("Entered onload")

    const encode = document.getElementById("encode");
    const decode = document.getElementById("decode");
    const upload = document.getElementById("uploadedFile");
    const textarea = document.getElementById("div3");
    const fileform = document.getElementById("fileform");

    const coder = new HuffmanCoder();           //Huffman class obj
    
    upload.addEventListener('change', ()=>{alert("File Uploaded")});

    //Encode Btn
    encode.onclick = function(){
        console.log("Hello");
        const uploadedFile = upload.files[0];

        if(uploadedFile === undefined){
            alert("No file uploaded.");
            return;
        }

        let nameSplit = uploadedFile.name.split('.');
        var extension = nameSplit[nameSplit.length-1].toLowerCase();
        if(extension != "txt"){
            alert("Invalid file type. Please upload a valid .txt file");
        }

        const fileReader = new FileReader();
        fileReader.onload = function(event){
            console.log("HELLO3");
            const text = event.target.result;
            if(text.length === 0){
                alert("Text cannot be empty. Upload another file.");
                return;
            }
            
            let [encoded, outputmsg] = coder.encode(text);
            
            downloadFile(uploadedFile.name.split('.')[0] + '_encoded.txt', encoded);
            // Ondownloadchanges
            fileform.reset();
            textarea.innerText = outputmsg;
           }
        fileReader.readAsText(uploadedFile, "UTF-8");
    }


    //Decode Button
    decode.onclick = function(){
        console.log("Decoding");
        const uploadedFile = upload.files[0];
        if(uploadedFile === undefined){
            alert("No file uploaded");
            return;
        }

        let nameSplit = uploadedFile.name.split('.');
        var extension = nameSplit[nameSplit.length-1].toLowerCase();
        if(extension != "txt"){
            alert("Invalid file type. Please upload a valid .txt file");
        }



        const fileReader = new FileReader();
        fileReader.onload = function(event){
            const text = event.target.result;

            if(text.length === 0){
                alert("Text cannot be empty. Upload another file.");
                return;
            }

            let [decoded_text, outputmsg] = coder.decode(text);
            downloadFile(uploadedFile.name.split('.')[0] + '_decoded.txt', decoded_text);
            textarea.innerText = outputmsg;
            fileform.reset();
        }
        fileReader.readAsText(uploadedFile, "UTF-8");
    }

    console.log("ONLOAD ENDED");
}








function downloadFile(filename, text){
    let a = document.createElement('a');
    a.href = "data:application/octet-stream," + encodeURIComponent(text);
    a.download = filename;
    console.log("a clicked")
    // return a;
    a.click();
}


console.log("Everything ENDED");