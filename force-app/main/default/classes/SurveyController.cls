public with sharing class SurveyController {

    // Method to save survey questions for a given category.
    @AuraEnabled
    public static void saveSurveyQuestions(String category, List<String> questions) {
        List<SurveyQuestion__c> surveyQuestions = new List<SurveyQuestion__c>();

        // Loop through each question in the provided list and create a SurveyQuestion__c record
        for (String questionText : questions) {
            SurveyQuestion__c question = new SurveyQuestion__c();
            question.Category__c = category;  // Set the category field
            question.QuestionText__c = questionText;  // Set the question text
            surveyQuestions.add(question);  // Add the question to the list
        }

        insert surveyQuestions;  // Insert the list of questions into the database
    }

    // Method to retrieve survey questions based on the provided category.
    @AuraEnabled
    public static List<SurveyQuestion__c> getSurveyQuestionsByCategory(String category) {
        // Perform a SOQL query to fetch questions for the specified category
        return [SELECT Id, QuestionText__c FROM SurveyQuestion__c WHERE Category__c = :category];
    }
// Method to save survey responses for a specific category.
@AuraEnabled
public static void saveSurveyResponses(String category, List<Map<String, Object>> responses) {
    List<SurveyResponse__c> surveyResponses = new List<SurveyResponse__c>();

    // Loop through each response and create a SurveyResponse__c record
    for (Map<String, Object> response : responses) {
        SurveyResponse__c surveyResponse = new SurveyResponse__c();
        surveyResponse.Category__c = category;  // Set the category field

        // Store the actual question text instead of the Id
        surveyResponse.SurveyQuestions__c = (String) response.get('questionText');  
        surveyResponse.Survey_Answers__c = (String) response.get('answer');  // Set the answer text
        surveyResponses.add(surveyResponse);  // Add the response to the list
    }

    insert surveyResponses;  // Insert the list of responses into the database
}
}




