import { LightningElement, track } from 'lwc'; // Import necessary modules from LWC framework
import getSurveyQuestionsByCategory from '@salesforce/apex/SurveyController.getSurveyQuestionsByCategory'; // Apex method to fetch survey questions by category
import saveSurveyResponses from '@salesforce/apex/SurveyController.saveSurveyResponses'; // Apex method to save survey responses
 
export default class CategorySurvey extends LightningElement {
    @track selectedCategory = ''; // Tracks the selected category from the combobox
    @track surveyQuestions = []; // Holds the list of survey questions fetched from Apex
    answers = {}; // Object to store the user's answers, where each key is a question ID
 
    // Getter method to provide the options for the category combobox
    get categoryOptions() {
        return [
            { label: 'None', value: 'None' },
            { label: 'Student', value: 'Student' },  
            { label: 'Teacher', value: 'Teacher' },  
            { label: 'Employee', value: 'Employee' },  
        ];
    }
 
    // Event handler for when the category is changed
    handleCategoryChange(event) {
        this.selectedCategory = event.detail.value; // Update the selected category
        this.loadSurveyQuestions(); // Load questions for the newly selected category
    }
 
    // Method to fetch survey questions based on the selected category
    loadSurveyQuestions() {
        getSurveyQuestionsByCategory({ category: this.selectedCategory })
            .then(result => {
                this.surveyQuestions = result || []; // Store the result in the surveyQuestions array
            })
            .catch(error => {
                console.error('Error fetching survey questions', error); // Log any errors
                this.surveyQuestions = []; // Reset the surveyQuestions array in case of failure
            });
    }
 
    // Event handler for when an answer is changed by the user
    handleAnswerChange(event) {
        const questionId = event.target.dataset.id; // Get the ID of the question
        this.answers[questionId] = event.detail.value; // Store the user's answer
    }
 
    // Method to submit the survey responses to the server
    submitSurvey() {
        const responses = Object.keys(this.answers).map(key => ({
            questionId: key,
            answer: this.answers[key]
        }));
 
        saveSurveyResponses({ category: this.selectedCategory, responses })
            .then(() => {
                console.log('Survey responses submitted successfully!'); // Log a success message
                alert('Your survey has been submitted successfully!'); // Show success alert
            })
            .catch(error => {
                console.error('Error submitting survey responses', error); // Log any errors
                alert('There was an error submitting your survey. Please try again.'); // Show error alert
            });
    }
}






