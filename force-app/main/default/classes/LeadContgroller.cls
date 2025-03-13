public with sharing class LeadContgroller {
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeads() {
        return [SELECT Id, FirstName, LastName, Email, Phone FROM Lead LIMIT 50];

    }

    // trigger NewContactTrigger on Account (before insert) {
    //     for(Contact con: Trigger.new){
    //         Contact newContact=new Contact();
    //         newContact.AccountId=con.AccountId;
    //         newContact.LastName=con.LastName;
    //         insert newContact;
    //     }
    // }
}