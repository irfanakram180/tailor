document.addEventListener('DOMContentLoaded', () => {
    const dataEntryLink = document.getElementById('dataEntryLink');
    const tailorRecordsLink = document.getElementById('tailorRecordsLink');
    const searchLink = document.getElementById('searchLink');
    const dataEntryContent = document.getElementById('dataEntryContent');
    const tailorRecordsContent = document.getElementById('tailorRecordsContent');
    const searchContent = document.getElementById('searchContent');
    const alertModal = document.getElementById('alertModal');
    const closeAlertButton = document.getElementById('closeAlertButton');
    const searchInput = document.getElementById('searchInput');
    const searchTable = document.getElementById('searchTable');
    const loader = document.getElementById('loader');
    const printButton = document.getElementById('printButton');
    const logoutButton = document.querySelector('.logout');

    dataEntryLink.addEventListener('click', () => {
        dataEntryContent.classList.add('active');
        tailorRecordsContent.classList.remove('active');
        searchContent.classList.remove('active');
    });

    tailorRecordsLink.addEventListener('click', () => {
        tailorRecordsContent.classList.add('active');
        dataEntryContent.classList.remove('active');
        searchContent.classList.remove('active');
        showData();
    });

    searchLink.addEventListener('click', () => {
        searchContent.classList.add('active');
        tailorRecordsContent.classList.remove('active');
        dataEntryContent.classList.remove('active');
        searchInput.value = '';  // Clear the search input
        searchTable.style.display = 'none';  // Hide the table initially
        printButton.style.display = 'none';  // Hide the print button initially
    });

    dataEntryContent.classList.add('active');

    loadData();

    document.getElementById('dataForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const date = document.getElementById('date').value;
        const tailorName = document.getElementById('tailorName').value;
        const orderId = document.getElementById('orderId').value;
        const perShirt = parseInt(document.getElementById('perShirt').value);

        let formData = JSON.parse(localStorage.getItem('formData')) || [];
        formData.push({ date, tailorName, orderId, perShirt });
        localStorage.setItem('formData', JSON.stringify(formData));

        document.getElementById('dataForm').reset();

        alertModal.style.display = 'flex';
    });

    closeAlertButton.addEventListener('click', () => {
        alertModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === alertModal) {
            alertModal.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', () => {
        loader.style.display = 'block';
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loader.style.display = 'block';
            setTimeout(showSearchResults, 500);  // Simulate a delay for loading
        }
    });

    printButton.addEventListener('click', () => {
        if (searchContent.classList.contains('active')) {
            window.print();
        }
    });

    logoutButton.addEventListener('click', () => {
        alert('Logged out!');
    });

    function loadData() {
        if (localStorage.getItem('formData')) {
            showData();
        }
    }

    function showData() {
        const tbody = document.querySelector('#orderTable tbody');
        tbody.innerHTML = '';

        let formData = JSON.parse(localStorage.getItem('formData')) || [];
        let totalShirts = 0;

        formData.forEach((data, index) => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.date}</td>
                <td>${data.tailorName}</td>
                <td>${data.orderId}</td>
                <td>${data.perShirt}</td>
                <td><button class="delete-button" data-index="${index}">Delete</button></td>
            `;
            tbody.appendChild(row);

            totalShirts += data.perShirt;
        });

        document.getElementById('totalShirts').innerText = totalShirts;

        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                deleteRecord(index);
            });
        });
    }

    function showSearchResults() {
        const tbody = document.querySelector('#searchTable tbody');
        tbody.innerHTML = '';

        let formData = JSON.parse(localStorage.getItem('formData')) || [];
        const searchValue = searchInput.value.toLowerCase();

        let totalPerShirt = 0;

        if (searchValue) {
            formData.forEach((data) => {
                if (data.tailorName.toLowerCase().includes(searchValue)) {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${data.date}</td>
                        <td>${data.tailorName}</td>
                        <td>${data.orderId}</td>
                        <td>${data.perShirt}</td>
                    `;
                    tbody.appendChild(row);

                    totalPerShirt += data.perShirt;
                }
            });

            document.getElementById('totalPerShirt').innerText = totalPerShirt;
            searchTable.style.display = 'table';  // Show the table
            printButton.style.display = 'block';  // Show the print button
        } else {
            searchTable.style.display = 'none';  // Hide the table if the search field is empty
            printButton.style.display = 'none';  // Hide the print button if the search field is empty
        }

        loader.style.display = 'none';  // Hide the loader once the search is complete
    }

    function deleteRecord(index) {
        let formData = JSON.parse(localStorage.getItem('formData')) || [];
        formData.splice(index, 1);
        localStorage.setItem('formData', JSON.stringify(formData));
        showData();
    }
});

document.getElementById('printExcelButton').addEventListener('click', () => {
    printToExcel();
});

document.getElementById('printPDFButton').addEventListener('click', () => {
    printToPDF();
});

function printToExcel() {
    const table = document.getElementById('searchTable');
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, 'table.xlsx');
}

function printToPDF() {
    const doc = new jsPDF();
    doc.autoTable({html: '#searchTable'});
    doc.save('table.pdf');
}
