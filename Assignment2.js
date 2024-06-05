var fs= require('fs');
/*Reading the File*/

/*fs.readFile('demo.txt' ,function(err,data){
    if(err){
        console.log(err);
    }
    console.log(data.toString());
})*/

/*Creating the File*/

/*var data = "New Content for New File";
fs.writeFile('demo1.txt',data,function(err){
    if(err){
        console.log(err);
    }
    console.log('Success. File is written');  
})*/

/*Updating the File*/

var data = "New Content for New File and I am changing the Content";
fs.writeFile('demo1.txt',data,function(err){
    if(err){
        console.log(err);
    }
    console.log('Success. File is written');  
})

/*Deleting the File*/

fs.unlinkSync('demo1.txt');