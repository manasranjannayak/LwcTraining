import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import getTotalAccountCount from '@salesforce/apex/AccountController.getTotalAccountCount';
import updateAccount from '@salesforce/apex/AccountController.updateAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
export default class AccountTable extends LightningElement {
    @track accounts = [];
    @track isLoading = false;
    @track currentPage = 1;
    @track totalRecords = 0;
    @track pageSize = 10;
    @track totalPages = 0;
    @track searchKey = '';
    @track sortField = 'Name';
    @track isAsc = true;
 
    connectedCallback() {
        this.fetchAccounts();
    }
 
    fetchAccounts() {
        this.isLoading = true;
        const offsetValue = (this.currentPage - 1) * this.pageSize;
 
        getAccounts({
            offsetValue,
            limitValue: this.pageSize,
            searchKey: this.searchKey,
            sortField: this.sortField,
            isAsc: this.isAsc
        })
        .then(result => {
            this.accounts = result;
            this.isLoading = false;
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
            this.isLoading = false;
        });
 
        this.calculateTotalPages();
    }
 
    calculateTotalPages() {
        getTotalAccountCount({ searchKey: this.searchKey })
        .then(result => {
            this.totalRecords = result;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
        });
    }
 
    handleEdit(event) {
        const { id, field } = event.target.dataset;
        const value = event.target.value;
 
        const updatedAccount = { Id: id, [field]: value };
        this.isLoading = true;
 
        updateAccount({ acc: updatedAccount })
        .then(() => {
            this.showToast('Success', 'Account updated successfully', 'success');
            this.isLoading = false;
            this.fetchAccounts();
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
            this.isLoading = false;
        });
    }
 
    handleSearchChange(event) {
        this.searchKey = event.target.value;
        this.currentPage = 1;
        this.fetchAccounts();
    }
 
    goToFirstPage() { this.currentPage = 1; this.fetchAccounts(); }
    goToPreviousPage() { if (this.currentPage > 1) this.currentPage--; this.fetchAccounts(); }
    goToNextPage() { if (this.currentPage < this.totalPages) this.currentPage++; this.fetchAccounts(); }
    goToLastPage() { this.currentPage = this.totalPages; this.fetchAccounts(); }
 
    sortByName() { this.sortField = 'Name'; this.isAsc = !this.isAsc; this.fetchAccounts(); }
    sortByPhone() { this.sortField = 'Phone'; this.isAsc = !this.isAsc; this.fetchAccounts(); }
    sortByIndustry() { this.sortField = 'Industry'; this.isAsc = !this.isAsc; this.fetchAccounts(); }
 
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
 
    get disableFirst() { return this.currentPage <= 1; }
    get disablePrevious() { return this.currentPage <= 1; }
    get disableNext() { return this.currentPage >= this.totalPages; }
    get disableLast() { return this.currentPage >= this.totalPages; }
}



// import { LightningElement, track } from 'lwc';
// import getAccounts from '@salesforce/apex/AccountController.getAccounts';
// import getTotalAccountCount from '@salesforce/apex/AccountController.getTotalAccountCount';
// import updateAccount from '@salesforce/apex/AccountController.updateAccount';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// export default class AccountTable extends LightningElement {
//     @track accounts = [];
//     @track isLoading = false;
//     @track currentPage = 1;
//     @track totalRecords = 0;
//     @track pageSize = 10;
//     @track totalPages = 0;
//     @track searchKey = '';
//     @track sortField = 'Name';
//     @track isAsc = true;

//     connectedCallback() {
//         this.fetchAccounts();
//     }

//     fetchAccounts() {
//         this.isLoading = true;
//         const offsetValue = (this.currentPage - 1) * this.pageSize;

//         getAccounts({
//             offsetValue,
//             limitValue: this.pageSize,
//             searchKey: this.searchKey,
//             sortField: this.sortField,
//             isAsc: this.isAsc
//         })
//         .then(result => {
//             this.accounts = result;
//             this.isLoading = false;
//         })
//         .catch(error => {
//             const message = error.body?.message || 'An error occurred while fetching accounts.';
//             this.showToast('Error', message, 'error');
//             this.isLoading = false;
//         });

//         this.calculateTotalPages();
//     }

//     calculateTotalPages() {
//         getTotalAccountCount({ searchKey: this.searchKey })
//         .then(result => {
//             this.totalRecords = result;
//             this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
//         })
//         .catch(error => {
//             const message = error.body?.message || 'An error occurred while counting accounts.';
//             this.showToast('Error', message, 'error');
//         });
//     }

//     handleEdit(event) {
//         const { id, field } = event.target.dataset;
//         const value = event.target.value;

//         const updatedAccount = { Id: id, [field]: value };
//         this.isLoading = true;

//         updateAccount({ acc: updatedAccount })
//         .then(() => {
//             this.showToast('Success', 'Account updated successfully', 'success');
//             this.isLoading = false;
//             this.fetchAccounts();
//         })
//         .catch(error => {
//             const message = error.body?.message || 'An error occurred while updating the account.';
//             this.showToast('Error', message, 'error');
//             this.isLoading = false;
//         });
//     }

//     handleSearchChange(event) {
//         this.searchKey = event.target.value;
//         this.currentPage = 1;
//         this.fetchAccounts();
//     }

//     goToFirstPage() { this.currentPage = 1; this.fetchAccounts(); }
//     goToPreviousPage() { if (this.currentPage > 1) this.currentPage--; this.fetchAccounts(); }
//     goToNextPage() { if (this.currentPage < this.totalPages) this.currentPage++; this.fetchAccounts(); }
//     goToLastPage() { this.currentPage = this.totalPages; this.fetchAccounts(); }

//     sortByName() { this.sortField = 'Name'; this.isAsc = !this.isAsc; this.fetchAccounts(); }
//     sortByPhone() { this.sortField = 'Phone'; this.isAsc = !this.isAsc; this.fetchAccounts(); }
//     sortByIndustry() { this.sortField = 'Industry'; this.isAsc = !this.isAsc; this.fetchAccounts(); }

//     showToast(title, message, variant) {
//         this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
//     }

//     get disableFirst() { return this.currentPage <= 1; }
//     get disablePrevious() { return this.currentPage <= 1; }
//     get disableNext() { return this.currentPage >= this.totalPages; }
//     get disableLast() { return this.currentPage >= this.totalPages; }
// }


//Manas Ranjan Nayak
