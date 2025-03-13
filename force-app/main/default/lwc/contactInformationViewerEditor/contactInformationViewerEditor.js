import { LightningElement, wire, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import updateContact from '@salesforce/apex/ContactController.updateContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class ContactInformationViewerEditor extends LightningElement {
    @track contacts;
    @track selectedContact;
    @track editedContact = {};
    wiredContactsResult;

    @wire(getContacts)
    wiredContacts(result) {
        this.wiredContactsResult = result;
        if (result.data) {
            this.contacts = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.contacts = undefined;
            this.error = result.error;
            console.error('Error fetching contacts:', this.error);
        }
    }

    handleSelectContact(event) {
        const contactId = event.target.dataset.id;
        this.selectedContact = this.contacts.find(contact => contact.Id === contactId);
        this.editedContact = { ...this.selectedContact }; // Create a copy to edit
    }

    handleInputChange(event) {
        const field = event.target.dataset.field;
        this.editedContact[field] = event.target.value;

        // Immediately update the contact on field change
        updateContact({ contactToUpdate: this.editedContact })
            .then(() => {
                this.showToast('Success', `${field} updated successfully`, 'success');
                this.selectedContact = { ...this.editedContact }; // Update displayed contact details
                return refreshApex(this.wiredContactsResult); // Refresh contact list
            })
            .catch(error => {
                this.showToast('Error', `Failed to update ${field}`, 'error');
                console.error('Error updating contact:', error);
            });
    }

    handleRefresh() {
        return refreshApex(this.wiredContactsResult);
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}
