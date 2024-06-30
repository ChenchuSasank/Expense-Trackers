let expenses = JSON.parse(localStorage.getItem('expenses')) || []; // Load from localStorage or initialize empty array

function showSection(sectionId) {
  document.getElementById('homeSection').style.display = 'none';
  document.getElementById('recordDataSection').style.display = 'none';
  document.getElementById('showDataSection').style.display = 'none';
  document.getElementById('modifyDataSection').style.display = 'none';

  document.getElementById(sectionId).style.display = 'block';
}

document.getElementById('recordForm').addEventListener('submit', function(event) {
  event.preventDefault();

  let category = document.getElementById('category').value;
  let amount = document.getElementById('amount').value;
  let information = document.getElementById('information').value;
  let date = document.getElementById('date_input').value;
  let id = Date.now(); // Generate a unique ID based on the current timestamp

  expenses.push({ id, category, amount, information, date });

  localStorage.setItem('expenses', JSON.stringify(expenses)); // Save to localStorage

  this.reset();
});

document.getElementById('modifyForm').addEventListener('submit', function(event) {
  event.preventDefault();

  let modifyCategory = document.getElementById('modifyCategory').value;
  let modifyAmount = document.getElementById('modifyAmount').value;
  let modifyInformation = document.getElementById('modifyInformation').value;
  let modifyDate = document.getElementById('modifyDate').value;

  let expenseFound = false;
  for (let i = 0; i < expenses.length; i++) {
    if (expenses[i].category === modifyCategory && expenses[i].information === modifyInformation && expenses[i].date === modifyDate) {
      expenses[i].amount = modifyAmount;
      expenseFound = true;
      break;
    }
  }

  if (expenseFound) {
    localStorage.setItem('expenses', JSON.stringify(expenses)); // Save to localStorage
  } else {
    alert('No matching record found to modify.');
  }

  this.reset();
});

function showCategoryData(category) {
  const dataDisplay = document.getElementById('dataDisplay');
  dataDisplay.innerHTML = '';

  const filteredExpenses = expenses.filter(expense => expense.category === category);
  const totalAmount = filteredExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

  if (filteredExpenses.length === 0) {
    dataDisplay.innerHTML = `<p>No ${category.toLowerCase()} recorded.</p>`;
  } else {
    const table = document.createElement('table');
    table.className = 'table table-striped';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Amount</th>
        <th>Information</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    filteredExpenses.forEach((expense, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${expense.amount}</td>
        <td>${expense.information}</td>
        <td>${expense.date}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteExpense('${category}', ${index})">Delete</button></td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
      <td colspan="3"><strong>Total</strong></td>
      <td><strong>${totalAmount.toFixed(2)}</strong></td>
    `;
    tbody.appendChild(totalRow);

    dataDisplay.appendChild(table);
  }
}

function deleteExpense(category, index) {
  const filteredExpenses = expenses.filter(expense => expense.category === category);
  const expenseToDelete = filteredExpenses[index];

  expenses = expenses.filter(expense => expense.id !== expenseToDelete.id);

  localStorage.setItem('expenses', JSON.stringify(expenses)); // Save to localStorage

  showCategoryData(category);
}

function showFilteredData(category, startDate, endDate) {
  const dataDisplay = document.getElementById('dataDisplay');
  dataDisplay.innerHTML = '';

  const filteredExpenses = expenses.filter(expense => 
    expense.category === category && 
    new Date(expense.date) >= new Date(startDate) && 
    new Date(expense.date) <= new Date(endDate)
  );
  const totalAmount = filteredExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

  if (filteredExpenses.length === 0) {
    dataDisplay.innerHTML = `<p>No ${category.toLowerCase()} recorded for the selected date range.</p>`;
  } else {
    const table = document.createElement('table');
    table.className = 'table table-striped';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Amount</th>
        <th>Information</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    filteredExpenses.forEach((expense, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${expense.amount}</td>
        <td>${expense.information}</td>
        <td>${expense.date}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteExpense('${category}', ${index})">Delete</button></td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
      <td colspan="3"><strong>Total</strong></td>
      <td><strong>${totalAmount.toFixed(2)}</strong></td>
    `;
    tbody.appendChild(totalRow);

    dataDisplay.appendChild(table);
  }
}

document.getElementById('dateFilterForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const category = document.querySelector('.btn-blue.active')?.textContent || 'Income';
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  showFilteredData(category, startDate, endDate);
});
