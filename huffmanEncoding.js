import { maxHeap } from "./maxHeap.js";
export {HuffmanCoder}


class HuffmanCoder {
    getMappings(node, path) {                //node-> huffman_tree
        if (typeof (node[1]) === "string") {        // leaf node which contains character in actual (internal nodes do not contains characters)
            this.mappings[node[1]] = path;
            return;
        }

        this.getMappings(node[1][0], path + "0");     // add 0 and move to left child
        this.getMappings(node[1][1], path + "1");    // add 1 and move to right child

    }


    tree_to_string(node) {           // node -> huffman tree
        if (typeof (node[1]) === "string") {
            return '\'' + node[1];
        }

        return '0' + this.tree_to_string(node[1][0]) + '1' + this.tree_to_string(node[1][1]);
    }


    string_to_tree(data){                       // data -> string  e.g. 0'a10'b1'c
        let node = [];

        if(data[this.idx] === '\''){              // BC -> When reached leaf node return node pushing single string in it
            this.idx++;
            node.push(data[this.idx]);
            this.idx++;
            return node;
        }

        // Otherwise make recc calls and add left and right component to node and return the node
        this.idx++;
        let left = this.string_to_tree(data);
        node.push(left);

        this.idx++;
        let right = this.string_to_tree(data);
        node.push(right);

        return node;
    }


    encode(data){       //data - >text to compress

        this.heap = new maxHeap();
        
        // Store frequency of each character
        const mp = new Map();
        for(let i=0;i<data.length;i++){
            if(data[i] in mp){
                mp[data[i]] = mp[data[i]] + 1;
            } else{
                mp[data[i]] = 1;
            }
        }

        // for(const key in mp){
        //     console.log(key, mp[key]);
        // }

        // Push all the lements to the min heap
        for(const key in mp){
            this.heap.push([-mp[key], key]);       // obj -> [value, key]      need to sort acc to frequencies

        } 

        // Create Huffman tree by picking smallest two elements until one element is left
        while(this.heap.size() > 1){
            const node1 = this.heap.pop();
            const node2 = this.heap.pop();

            const node = [node1[0]+node2[0],[node1,node2]];
            this.heap.push(node);
        }
        //only node present in heap is huffman tree
        const huffman_tree = this.heap.pop();

        console.log(huffman_tree);

        //charater to binary code conversion using huffman_tree (here, huffman algo is implemented in actual)       e.g. a->0010 b->1011 ..........
        this.mappings = {};
        this.getMappings(huffman_tree, "");

        // let us get binary string corresponding to "data"
        let binary_string = "";
        for(let i=0;i<data.length;i++) {
            console.log(this.mappings[data[i]]);

            binary_string = binary_string + this.mappings[data[i]];
        }

        console.log(binary_string);

        // padding to make binary_string multiple of 8
        let rem = (8 - binary_string.length%8)%8;
        let padding = "";
        for(let i=0;i<rem;i++){
            padding = padding + "0";
        }

        console.log(padding);

        binary_string = binary_string + padding;

        // Binary string to corresponding character  -> each 8 bits are converted to corresponding number.  8 bits -> 0 <= num <=255
        let result = "";
        for(let i=0;i<binary_string.length;i+=8){
            let num = 0;
            for(let j=0;j<8;j++){
                num = num*2 + (binary_string[i+j]-"0");
            }
            result = result + String.fromCharCode(num);     //convert number back to equivalent char using num as ASCII
        }
        console.log(result);
        // Now result store the encoded string

        // We not only need encoded string, but also, huffman tree, padding added to decode. Thus we need to store these and then return final ans
        let final_res = this.tree_to_string(huffman_tree) + '\n' + rem + '\n' + result;
        let outputmsg = "Compression Ratio : " + data.length/final_res.length;
        outputmsg = "Compression complete and file sent for download." + '\n' + outputmsg;
        return [final_res, outputmsg];
    }


    

    decode(data){                       // data -> data from encodedfile
        data = data.split('\n');
        if(data.length === 4){
            // Handling new line
            data[0] = data[0] + '\n' + data[1];         //tree
            data[1] = data[2];                          //padding
            data[2] = data[3];                          //encoded text
            data.pop();
        }

        this.idx = 0;

        const huffman_tree = this.string_to_tree(data[0]);
        const text = data[2];

        // Convert encoded text to binary string
        let binary_string = "";
        for(let i=0;i<text.length;i++){
            let num = text[i].charCodeAt(0);        //returns corresponding ASCII
            let bin = "";
            for(let j=0;j<8;j++){                   //convert into binary form
                bin = num%2 + bin;
                num = Math.floor(num/2);
            }
            binary_string = binary_string + bin;
        }
        // remove padding bits
        binary_string = binary_string.substring(0,binary_string.length-data[1]);

        // console.log(binary_string.length);

        let res = "";
        let node = huffman_tree;

        // Now we have tree as well as encoded data in binary string form
        // Thus convert to equivalent actual text by traversing upto leaf 
        for(let i=0;i<binary_string.length;i++){
            if(binary_string[i]==='0'){                 //go to left child
                node = node[0];
            } else{
                node = node[1];                        //else '1' thus go to right child
            }

            if(typeof(node[0])==="string"){             //If reached leaf node
                res += node[0];                         //add char to ans
                node = huffman_tree;                 //reset curr_node to head of tree
            }
        }
        let outputmsg = "Decompression complete and file sent for download."
        return [res, outputmsg];
    }


   


}