import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  title = 'file-upload-read-data-app';
  file:any;
  headersArray=[];
customerIssueArray=[];
resultArray=[];
outputArray=[];
showResult:boolean = false;
pageSize:number=2;
page:number=1;
collectionSize:number;
comparator:number =1;
count:number;
errorMessage:string;
staticAlertClosed=false;

  upload(files: File[]){
    this.file=files[0];
    if(this.isValidFile(this.file)){
    let fileReader = new FileReader();
    fileReader.readAsText(this.file);
    fileReader.onload = (e) => {
      let csvData=fileReader.result;
      let csvRecordsArray=(<string>csvData).split("\n");
      this.getHeaderArray(csvRecordsArray);
      this.getBodyArray(csvRecordsArray);
   //   console.log("csvRecordArray :"+csvRecordsArray);
   this.showResult=true;
    };
  }
  }

  isValidFile(file:any):boolean{
 return file.name.endsWith(".csv");
  }

  getHeaderArray(inputArray:string[]){
      let headers = (<string> inputArray[0]).split(',');
      console.log("header length: "+headers.length);
      for(let i=0;i<headers.length;i++)
         this.headersArray.push(headers[i].trim().substring(1,headers[i].lastIndexOf('"')));
         console.log(this.headersArray);
  }

  getBodyArray(inputArray:string[]){
    for(let j=1;j<inputArray.length;j++){
       let bodyLine = (<string>inputArray[j]).split(',');
       this.collectionSize=bodyLine.length;
       if(bodyLine.length==this.headersArray.length){
         let customer:CustomerIssue = new CustomerIssue();
         customer.firstName=bodyLine[0].trim().substring(1,bodyLine[0].lastIndexOf('"'));
         customer.lastName=bodyLine[1].trim().substring(1,bodyLine[1].lastIndexOf('"'));
         customer.issueCount=+bodyLine[2].trim().substring(1,bodyLine[2].lastIndexOf('"'));
         customer.dob=new Date(bodyLine[3].trim().substring(1,bodyLine[3].lastIndexOf('"')));
         this.customerIssueArray.push(customer);
         console.log("customer value:"+customer.dob.toDateString());
       }else{
         // we can have our own logic to show the errored lines
       }
    }
    this.outputArray=this.customerIssueArray;
    this.collectionSize=this.outputArray.length;
    this.refreshIssues();
  }
  refreshIssues() {
    this.resultArray = this.outputArray
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  filter(){
     if(this.count==null||this.count<=0){
           this.errorMessage="Please enter a value greated than zero";
           this.staticAlertClosed=true;
           this.callTimeout();   
     }else{
       this.outputArray=this.customerIssueArray.filter((result)=>{
        console.log("currentvalue :"+result.issueCount); 
        let filteredValue;
        if(this.comparator==1){
        if(result.issueCount<=this.count)
        {filteredValue=result;}
        }else{
          if(result.issueCount>=this.count)
        {filteredValue=result;}
        }
        return filteredValue;
      });
       this.collectionSize=this.outputArray.length;
       this.refreshIssues();
       console.log(this.collectionSize);
     }
  }

  callTimeout(){
setTimeout(() => {
  this.staticAlertClosed=false;
}, 5000);
  }

  reset(){
    this.outputArray=this.customerIssueArray;
    this.collectionSize=this.outputArray.length;
    this.count=0;
    this.refreshIssues();
  }

}

export class CustomerIssue{

  firstName: string;
  lastName: string;
  issueCount: number;
  dob: Date;

}
