import { LightningElement,wire } from 'lwc';
import getLeads from '@salesforce/apex/LeadController.getLeads';

export default class ListOfLeads extends LightningElement {
    leads;
    colmons=[
        {label:'Name', fieldName:'name'},
        {label:'Company', fieldName:'company'},
        {label:'Lead Status', fieldName:'status'},
        {label:'Phone', fieldName:'phone'},
        {label:'Email', fieldName:'email'},
    ]
    @wire(getLeads)
    wireleads({error,data}) {
        if(data){
            this.leads=data;
        }
        else if(error){
            this.leads=error;
        }
    }
}