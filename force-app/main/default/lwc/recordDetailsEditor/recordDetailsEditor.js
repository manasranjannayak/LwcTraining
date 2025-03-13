import { LightningElement, api, wire } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getFieldValue } from 'lightning/uiRecordApi';

const FIELDS = ['Account.Name', 'Account.Phone', 'Account.Industry'];

export default class RecordDetailsEditor extends LightningElement {

    @api recordId; // This will come from the parent component or page
    @api objectApiName = 'Account'; // Default is Account, but can be customized

    recordData;
    error;
    isSaving = false;

    // Fetch the record using the @wire decorator
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (data) {
            this.recordData = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.recordData = undefined;
        }
    }

    // Input change handler to keep track of changes
    handleInputChange(event) {
        const field = event.target.dataset.field;
        this.recordData = { ...this.recordData, [field]: event.target.value };
    }

    // Save changes to the record
    saveRecord() {
        this.isSaving = true;
        const fields = {};
        fields['Id'] = this.recordId;

        // Add modified fields
        this.template.querySelectorAll('.editable-field').forEach((input) => {
            fields[input.dataset.field] = input.value;
        });

        const recordInput = { fields };
        updateRecord(recordInput)
            .then(() => {
                this.isSaving = false;
                this.showToast('Success', 'Record updated successfully', 'success');
            })
            .catch((error) => {
                this.isSaving = false;
                this.showToast('Error', error.body.message, 'error');
            });
    }

    // Validation and event handling
    // then uses the reduce() method to iterate over all the selected input elements and calls checkValidity() on each input.
    validateFields() {
        const allValid = [...this.template.querySelectorAll('.editable-field')].reduce(
            (validSoFar, input) => validSoFar && input.checkValidity(),
            true
        );
        return allValid;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant,
        }));
    }
}