class EmployeeManagement {
    constructor() {
        this.employees = [];
        this.selectedEmployee = null;
        this.form = document.getElementById('employeeForm');
        this.table = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
        
        // Input fields
        this.empId = document.getElementById('empId');
        this.empName = document.getElementById('empName');
        this.empDesignation = document.getElementById('empDesignation');
        this.empSalary = document.getElementById('empSalary');
        
        // Buttons
        this.addBtn = document.getElementById('addBtn');
        this.modifyBtn = document.getElementById('modifyBtn');
        this.deleteBtn = document.getElementById('deleteBtn');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.addBtn.addEventListener('click', () => this.addEmployee());
        this.modifyBtn.addEventListener('click', () => this.modifyEmployee());
        this.deleteBtn.addEventListener('click', () => this.deleteEmployee());
        this.empId.addEventListener('input', () => this.autofillById());
        
        // Disable modify and delete buttons initially
        this.modifyBtn.disabled = true;
        this.deleteBtn.disabled = true;
    }
    
    showNotification(message) {
        alert(message);
    }
    
    getFormData() {
        return {
            id: this.empId.value,
            name: this.empName.value,
            designation: this.empDesignation.value,
            gender: document.querySelector('input[name="gender"]:checked')?.value || '',
            salary: this.empSalary.value
        };
    }
    
    validateForm(data) {
        return data.id && data.name && data.designation && data.gender && data.salary;
    }
    
    clearForm() {
        this.form.reset();
        this.selectedEmployee = null;
        this.modifyBtn.disabled = true;
        this.deleteBtn.disabled = true;
        const selectedRow = document.querySelector('tr.selected');
        if (selectedRow) selectedRow.classList.remove('selected');
    }
    
    addEmployee() {
        const data = this.getFormData();
        
        if (!this.validateForm(data)) {
            this.showNotification('Please fill all the fields');
            return;
        }
        
        if (this.employees.some(emp => emp.id === data.id && emp !== this.selectedEmployee)) {
            this.showNotification('Employee ID already exists');
            return;
        }
        
        if (this.selectedEmployee) {
            // Update existing employee
            const index = this.employees.findIndex(emp => emp.id === this.selectedEmployee.id);
            if (index !== -1) {
                this.employees[index] = data;
            }
        } else {
            // Add new employee
            this.employees.push(data);
        }
        
        this.updateTable();
        this.clearForm();
        this.showNotification(this.selectedEmployee ? 'Employee Modified Successfully' : 'New Employee Added Successfully');
    }
    
    modifyEmployee() {
        if (!this.selectedEmployee) {
            this.showNotification('Please select an employee to modify');
            return;
        }
        
        const data = this.getFormData();
        
        if (!this.validateForm(data)) {
            this.showNotification('Please fill all the fields');
            return;
        }
        
        const index = this.employees.findIndex(emp => emp.id === this.selectedEmployee.id);
        if (index !== -1) {
            this.employees[index] = data;
            this.updateTable();
            this.clearForm();
            this.showNotification('Employee Modified Successfully');
        }
    }
    
    deleteEmployee() {
        if (!this.selectedEmployee) {
            this.showNotification('Please select an employee to delete');
            return;
        }
        
        const index = this.employees.findIndex(emp => emp.id === this.selectedEmployee.id);
        if (index !== -1) {
            this.employees.splice(index, 1);
            this.updateTable();
            this.clearForm();
            this.showNotification('Employee Deleted Successfully');
        }
    }
    
    updateTable() {
        this.table.innerHTML = '';
        
        this.employees.forEach(employee => {
            const row = this.table.insertRow();
            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.designation}</td>
                <td>${employee.gender}</td>
                <td>${employee.salary}</td>
            `;
            
            row.addEventListener('click', () => {
                const selectedRow = document.querySelector('tr.selected');
                if (selectedRow) selectedRow.classList.remove('selected');
                
                row.classList.add('selected');
                this.selectedEmployee = employee;
                
                // Fill form with selected employee data
                this.empId.value = employee.id;
                this.empName.value = employee.name;
                this.empDesignation.value = employee.designation;
                document.querySelector(`input[name="gender"][value="${employee.gender}"]`).checked = true;
                this.empSalary.value = employee.salary;
                
                // Enable modify and delete buttons
                this.modifyBtn.disabled = false;
                this.deleteBtn.disabled = false;
            });
        });
    }

    autofillById() {
        const id = this.empId.value;
        const employee = this.employees.find(emp => emp.id === id);
        if (employee) {
            this.empName.value = employee.name;
            this.empDesignation.value = employee.designation;
            document.querySelector(`input[name="gender"][value="${employee.gender}"]`).checked = true;
            this.empSalary.value = employee.salary;
            this.selectedEmployee = employee;
            this.modifyBtn.disabled = false;
            this.deleteBtn.disabled = false;
            // Optionally, highlight the row in the table
            this.highlightRowById(id);
        } else {
            this.empName.value = '';
            this.empDesignation.value = '';
            document.querySelectorAll('input[name="gender"]').forEach(r => r.checked = false);
            this.empSalary.value = '';
            this.selectedEmployee = null;
            this.modifyBtn.disabled = true;
            this.deleteBtn.disabled = true;
            this.removeRowHighlight();
        }
    }

    highlightRowById(id) {
        this.removeRowHighlight();
        Array.from(this.table.rows).forEach(row => {
            if (row.cells[0].textContent === id) {
                row.classList.add('selected');
            }
        });
    }

    removeRowHighlight() {
        Array.from(this.table.rows).forEach(row => row.classList.remove('selected'));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new EmployeeManagement();
});