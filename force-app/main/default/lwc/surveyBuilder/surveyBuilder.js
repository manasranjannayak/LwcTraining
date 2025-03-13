import { LightningElement, track } from 'lwc';                                            
import saveSurveyQuestions from '@salesforce/apex/SurveyController.saveSurveyQuestions';    
 
export default class SurveyBuilder extends LightningElement {
    @track selectedCategory = '';  
    @track questions = [{ id: 1, text: '' }];
 
    // Getter to return category options for the combobox
    get categoryOptions() {
        return [
            { label: 'None', value: 'None' },
            { label: 'Student', value: 'Student' },
            { label: 'Teacher', value: 'Teacher' },
            { label: 'Employee', value: 'Employee' },
        ];
    }
 
    // Handles the change event for category selection
    handleCategoryChange(event) {
        this.selectedCategory = event.detail.value;
    }
 
    // Handles changes in the input fields for the survey questions
    handleQuestionChange(event) {
        const questionId = event.target.dataset.id;
        const questionIndex = this.questions.findIndex(q => q.id === parseInt(questionId));
        this.questions[questionIndex].text = event.detail.value;
    }
 
    // Adds a new blank question to the list
    addQuestion() {
        this.questions.push({ id: this.questions.length + 1, text: '' });
    }
 
    // Validates the survey questions and saves them if valid
    validateAndSaveQuestions() {
        const allInputs = this.template.querySelectorAll('lightning-input');
        let allValid = true;
 
        // Check if all the input fields are filled
        allInputs.forEach(input => {
            if (!input.value) {
                input.setCustomValidity("This field is required");
                input.reportValidity();
                allValid = false;
            } else {
                input.setCustomValidity("");
                input.reportValidity();
            }
        });
 
        // If all fields are valid, proceed with the save
        if (allValid) {
            const questionTexts = this.questions.map(q => q.text).filter(text => text);
            saveSurveyQuestions({ category: this.selectedCategory, questions: questionTexts })
                .then(() => {
                    this.questions = [{ id: 1, text: '' }];
                    alert('Questions saved successfully!');
                })
                .catch(error => {
                    console.error('Error saving questions', error);
                    alert('Error saving questions: ' + error.body.message);
                });
        } else {
            alert('Please fill in all the required fields before saving.');
        }
    }
}






