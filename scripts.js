let expenses = []; // Array to hold the expense records

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

  expenses.push({ category, amount, information, date });

  this.reset();
});

document.getElementById('modifyForm').addEventListener('submit', function(event) {
  event.preventDefault();

  let modifyCategory = document.getElementById('modifyCategory').value;
  let modifyAmount = document.getElementById('modifyAmount').value;
  let modifyInformation = document.getElementById('modifyInformation').value;
  let modifyDate = document.getElementById('modifyDate').value;

  for (let expense of expenses) {
    if (expense.category === modifyCategory && expense.information === modifyInformation && expense.date === modifyDate) {
      expense.amount = modifyAmount;
      break;
    }
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
  const expenseIndex = expenses.findIndex((expense, idx) => expense.category === category && idx === index);

  expenses.splice(expenseIndex, 1);

  showCategoryData(category);
}