
public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(Integer offsetValue, Integer limitValue, String searchKey, String sortField, Boolean isAsc) {
        String query = 'SELECT Id, Name, Phone, Industry FROM Account';

        // Apply search filter if provided
        if (String.isNotBlank(searchKey)) {
            query += ' WHERE Name LIKE \'%' + String.escapeSingleQuotes(searchKey) + '%\'';
        }

        // Apply sorting if provided
        if (String.isNotBlank(sortField)) {
            query += ' ORDER BY ' + sortField + (isAsc ? ' ASC' : ' DESC');
        } else {
            query += ' ORDER BY Name ASC';
        }

        query += ' LIMIT :limitValue OFFSET :offsetValue';
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static Integer getTotalAccountCount(String searchKey) {
        String query = 'SELECT COUNT() FROM Account';

        // Apply search filter if provided
        if (String.isNotBlank(searchKey)) {
            query += ' WHERE Name LIKE \'%' + String.escapeSingleQuotes(searchKey) + '%\'';
        }

        return (Integer) Database.countQuery(query);
    }

    @AuraEnabled
    public static void updateAccount(Account acc) {
        try {
            update acc;
        } catch (DmlException e) {
            throw new AuraHandledException('Error updating Account: ' + e.getMessage());
        }
    }
}

