"use strict";
const table = document.querySelector("table");
const headers = document.querySelectorAll("thead th");
const tbody = document.querySelector("tbody");
const rows = Array.from(tbody.querySelectorAll("tr"));
addRowClickListener();
let sortColumnIndex = null;
let sortDirection = 1; // 1 for ascending, -1 for descending
headers.forEach((header, index)=>{
    header.addEventListener("click", ()=>{
        if (sortColumnIndex === index) sortDirection *= -1;
        else {
            sortColumnIndex = index;
            sortDirection = 1;
        }
        rows.sort((rowA, rowB)=>{
            const cellA = rowA.children[index].textContent.trim();
            const cellB = rowB.children[index].textContent.trim();
            const rawA = cellA.replace(/[^\d.-]/g, "");
            const rawB = cellB.replace(/[^\d.-]/g, "");
            const valueA = rawA === "" ? cellA : parseFloat(rawA);
            const valueB = rawB === "" ? cellB : parseFloat(rawB);
            if (valueA < valueB) return -1 * sortDirection;
            if (valueA > valueB) return 1 * sortDirection;
            return 0;
        });
        tbody.innerHTML = "";
        rows.forEach((row)=>{
            tbody.appendChild(row);
        });
        addRowClickListener();
    });
});
function addRowClickListener() {
    rows.forEach((row)=>{
        row.addEventListener("click", ()=>{
            rows.forEach((r)=>r.classList.remove("active"));
            row.classList.add("active");
        });
    });
}
const form = document.createElement("form");
form.classList.add("new-employee-form");
const fields = [
    {
        label: "Name",
        type: "text",
        name: "name"
    },
    {
        label: "Position",
        type: "text",
        name: "position"
    },
    {
        label: "Age",
        type: "number",
        name: "age"
    },
    {
        label: "Salary",
        type: "number",
        name: "salary"
    }
];
fields.forEach((field)=>{
    const wrapper = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");
    label.textContent = field.label + ":";
    label.setAttribute("for", field.name);
    input.setAttribute("type", field.type);
    input.setAttribute("name", field.name);
    input.setAttribute("id", field.name);
    input.setAttribute("data-qa", field.name);
    wrapper.append(label, input);
    form.appendChild(wrapper);
});
const officeWrapper = document.createElement("div");
const officeLabel = document.createElement("label");
const officeSelect = document.createElement("select");
officeLabel.textContent = "Office:";
officeLabel.setAttribute("for", "office");
officeSelect.setAttribute("name", "office");
officeSelect.setAttribute("id", "office");
officeSelect.setAttribute("data-qa", "office");
const offices = [
    "Tokyo",
    "Singapore",
    "London",
    "New York",
    "Edinburgh",
    "San Francisco"
];
offices.forEach((city)=>{
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    officeSelect.appendChild(option);
});
officeWrapper.append(officeLabel, officeSelect);
form.insertBefore(officeWrapper, form.children[2]);
const saveButton = document.createElement("button");
saveButton.type = "submit";
saveButton.textContent = "Save to table";
form.appendChild(saveButton);
const parentTable = table.parentElement;
parentTable.insertBefore(form, table.nextSibling);
function showNotification(message, isError = false) {
    let notification = document.querySelector('[data-qa="notification"]');
    if (!notification) {
        notification = document.createElement("div");
        notification.setAttribute("data-qa", "notification");
        notification.classList.add("notification");
        form.parentElement.insertBefore(notification, form.nextSibling);
    }
    notification.textContent = message;
    notification.classList.remove("error", "success");
    notification.classList.add(isError ? "error" : "success");
}
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const nameLb = form.elements["name"].value.trim();
    const positionLb = form.elements["position"].value.trim();
    const officeLb = form.elements["office"].value.trim();
    const ageLb = Number(form.elements["age"].value);
    const salaryLb = form.elements["salary"].value.trim();
    if (nameLb.length < 4) {
        showNotification("\u041F\u043E\u043C\u0438\u043B\u043A\u0430: \u0406\u043C\u2019\u044F \u043C\u0430\u0454 \u043C\u0456\u0441\u0442\u0438\u0442\u0438 \u0449\u043E\u043D\u0430\u0439\u043C\u0435\u043D\u0448\u0435 4 \u043B\u0456\u0442\u0435\u0440\u0438.", true);
        return;
    }
    if (positionLb.length < 2) {
        showNotification("\u041F\u043E\u043C\u0438\u043B\u043A\u0430: \u041F\u043E\u0441\u0430\u0434\u0430 \u043C\u0430\u0454 \u043C\u0456\u0441\u0442\u0438\u0442\u0438 \u0449\u043E\u043D\u0430\u0439\u043C\u0435\u043D\u0448\u0435 2 \u0441\u0438\u043C\u0432\u043E\u043B\u0438.", true);
        return;
    }
    if (ageLb < 18 || ageLb > 90) {
        showNotification("\u041F\u043E\u043C\u0438\u043B\u043A\u0430: \u0412\u0456\u043A \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0432\u0456\u0434 18 \u0434\u043E 90 \u0440\u043E\u043A\u0456\u0432.", true);
        return;
    }
    function formatSalary(salary) {
        const num = Number(salary);
        if (isNaN(num)) return salary;
        return "$" + num.toLocaleString("en-US");
    }
    const newRow = document.createElement("tr");
    const cellsData = [
        nameLb,
        positionLb,
        officeLb,
        ageLb,
        formatSalary(salaryLb)
    ];
    cellsData.forEach((data)=>{
        const td = document.createElement("td");
        td.textContent = data;
        newRow.appendChild(td);
    });
    tbody.appendChild(newRow);
    rows.push(newRow);
    addRowClickListener();
    showNotification("\u041D\u043E\u0432\u0438\u0439 \u0441\u043F\u0456\u0432\u0440\u043E\u0431\u0456\u0442\u043D\u0438\u043A \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0434\u043E\u0434\u0430\u043D\u0438\u0439 \u0434\u043E \u0442\u0430\u0431\u043B\u0438\u0446\u0456.");
    form.reset();
});
let editingCell = null;
let originalValue = null;
tbody.addEventListener("dblclick", (e)=>{
    const target = e.target;
    if (target.tagName !== "TD") return;
    if (editingCell && editingCell !== target) finishEditing();
    if (editingCell === target) return;
    originalValue = target.textContent;
    editingCell = target;
    const input = document.createElement("input");
    input.type = "text";
    input.value = originalValue;
    input.className = "cell-input";
    target.textContent = "";
    target.appendChild(input);
    input.focus();
    input.addEventListener("blur", ()=>{
        finishEditing();
    });
    input.addEventListener("keydown", (ev)=>{
        if (ev.key === "Enter") {
            ev.preventDefault();
            finishEditing();
        }
    });
});
function finishEditing(save = true) {
    if (!editingCell) return;
    const input = editingCell.querySelector("input.cell-input");
    if (!input) return;
    let newValue = input.value.trim();
    if (!save || newValue === "") newValue = originalValue;
    editingCell.textContent = newValue;
    editingCell = null;
    originalValue = null;
}

//# sourceMappingURL=index.f75de5e1.js.map
