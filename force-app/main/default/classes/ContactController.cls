public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [SELECT Id, FirstName, LastName, Email, Phone FROM Contact LIMIT 50];
    }
    
    @AuraEnabled
    public static void updateContact(Contact contactToUpdate) {
        update contactToUpdate;
    }
}

