document.addEventListener('DOMContentLoaded', () => {
    const storedLinks = JSON.parse(localStorage.getItem('links')) || [];
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];

    const linkSelector = document.getElementById('link-selector');
    const employeeSelector = document.getElementById('employee-selector');
    const visitBtn = document.getElementById('visit-link');
    const manageBtn = document.getElementById('manage-btn');
    const linkManagement = document.getElementById('link-management');
    const userManagement = document.getElementById('user-management');
    const dataManagement = document.getElementById('data-management');
    const linkSubmenu = document.getElementById('link-submenu');
    const userSubmenu = document.getElementById('user-submenu');
    const dataSubmenu = document.getElementById('data-submenu');
    const addLinkBtn = document.getElementById('add-link');
    const addUserBtn = document.getElementById('add-user');
    const addLinkForm = document.getElementById('add-link-form');
    const addUserForm = document.getElementById('add-user-form');
    const saveLinkBtn = document.getElementById('save-link');
    const saveUserBtn = document.getElementById('save-user');
    const cancelLinkBtn = document.getElementById('cancel-link');
    const cancelUserBtn = document.getElementById('cancel-user');
    const linkNameInput = document.getElementById('link-name');
    const accessLinkInput = document.getElementById('access-link');
    const usernameTypeSelect = document.getElementById('username-type');
    const userNameInput = document.getElementById('user-name');
    const userIdInput = document.getElementById('user-id');
    const linkList = document.getElementById('link-list');
    const userList = document.getElementById('user-list');
    const importFileInput = document.getElementById('import-file');

    function updateSelectors() {
        linkSelector.innerHTML = storedLinks.length ? storedLinks.map(link => 
            `<option value="${link.name}">${link.name}</option>`).join('') : 
            '<option value="">请至少添加一条访问链接</option>';
        linkSelector.disabled = !storedLinks.length;

        employeeSelector.innerHTML = storedEmployees.length ? storedEmployees.map(employee => 
            `<option value="${employee.id}">${employee.name} (${employee.id})</option>`).join('') : 
            '<option value="">请至少添加一位用户及工号</option>';
        employeeSelector.disabled = !storedEmployees.length;

        updateVisitButtonState();
    }

    function updateVisitButtonState() {
        visitBtn.disabled = !(linkSelector.value && employeeSelector.value);
        visitBtn.classList.toggle('disabled', visitBtn.disabled);
    }

    function updateManagementLists() {
        linkList.innerHTML = storedLinks.map((link, index) => 
            `<div class="item">${link.name} - ${link.url} (${link.type === 'plaintext' ? '明文' : '掩码'})<button onclick="deleteLink(${index})">删除</button></div>`).join('');
        userList.innerHTML = storedEmployees.map((employee, index) => 
            `<div class="item">${employee.name} (${employee.id})<button onclick="deleteUser(${index})">删除</button></div>`).join('');
    }

    updateSelectors();
    updateManagementLists();

    manageBtn.addEventListener('click', () => {
        const isVisible = [linkSubmenu, userSubmenu, dataSubmenu].some(menu => menu.style.display === 'block');
        [linkSubmenu, userSubmenu, dataSubmenu, linkManagement, userManagement, dataManagement, addLinkForm, addUserForm].forEach(menu => menu.style.display = 'none');
        if (!isVisible) [linkSubmenu, userSubmenu, dataSubmenu].forEach(menu => menu.style.display = 'block');
    });

    document.getElementById('link-management-btn').addEventListener('click', () => {
        [linkManagement, addLinkForm].forEach(menu => menu.style.display = 'block');
        [userManagement, dataManagement, addUserForm].forEach(menu => menu.style.display = 'none');
    });

    document.getElementById('user-management-btn').addEventListener('click', () => {
        [userManagement, addUserForm].forEach(menu => menu.style.display = 'block');
        [linkManagement, dataManagement, addLinkForm].forEach(menu => menu.style.display = 'none');
    });

    document.getElementById('data-management-btn').addEventListener('click', () => {
        [dataManagement].forEach(menu => menu.style.display = 'block');
        [linkManagement, userManagement, addLinkForm, addUserForm].forEach(menu => menu.style.display = 'none');
    });

    addLinkBtn.addEventListener('click', () => addLinkForm.style.display = 'block');
    addUserBtn.addEventListener('click', () => addUserForm.style.display = 'block');
    cancelLinkBtn.addEventListener('click', () => addLinkForm.style.display = 'none');
    cancelUserBtn.addEventListener('click', () => addUserForm.style.display = 'none');

    saveLinkBtn.addEventListener('click', () => {
        const linkName = linkNameInput.value;
        const accessLink = accessLinkInput.value;
        const usernameType = usernameTypeSelect.value;

        if (!linkName || !accessLink) return alert('请填写链接名称和访问链接');

        storedLinks.push({ name: linkName, url: accessLink, type: usernameType });
        localStorage.setItem('links', JSON.stringify(storedLinks));
        updateSelectors();
        updateManagementLists();
        [linkNameInput, accessLinkInput].forEach(input => input.value = '');
    });

    saveUserBtn.addEventListener('click', () => {
        const userName = userNameInput.value;
        const userId = userIdInput.value;

        if (!userName || !userId) return alert('请填写姓名和工号');

        storedEmployees.push({ name: userName, id: userId });
        localStorage.setItem('employees', JSON.stringify(storedEmployees));
        updateSelectors();
        updateManagementLists();
        [userNameInput, userIdInput].forEach(input => input.value = '');
    });

    visitBtn.addEventListener('click', () => {
        const selectedLink = storedLinks.find(link => link.name === linkSelector.value);
        const selectedEmployee = storedEmployees.find(employee => employee.id === employeeSelector.value);

        if (!selectedLink || !selectedEmployee) return alert('请选择一个链接和一个员工');

        const visitUrl = selectedLink.url.replace('[username]', selectedLink.type === 'masked' ? btoa(selectedEmployee.id) : selectedEmployee.id);
        window.open(visitUrl, '_blank');
    });

    window.deleteLink = index => {
        if (confirm('您确定要删除这个链接吗？')) {
            storedLinks.splice(index, 1);
            localStorage.setItem('links', JSON.stringify(storedLinks));
            updateSelectors();
            updateManagementLists();
        }
    };

    window.deleteUser = index => {
        if (confirm('您确定要删除这个用户吗？')) {
            storedEmployees.splice(index, 1);
            localStorage.setItem('employees', JSON.stringify(storedEmployees));
            updateSelectors();
            updateManagementLists();
        }
    };

    document.getElementById('export-data').addEventListener('click', () => {
        const data = { links: storedLinks, employees: storedEmployees };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json';
        link.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('import-data').addEventListener('click', () => importFileInput.click());

    importFileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const importedData = JSON.parse(reader.result);
                    if (importedData.links) {
                        storedLinks.length = 0;
                        storedLinks.push(...importedData.links);
                    }
                    if (importedData.employees) {
                        storedEmployees.length = 0;
                        storedEmployees.push(...importedData.employees);
                    }
                    localStorage.setItem('links', JSON.stringify(storedLinks));
                    localStorage.setItem('employees', JSON.stringify(storedEmployees));
                    updateSelectors();
                    updateManagementLists();
                    alert('数据导入成功');
                } catch (err) {
                    alert('导入数据格式错误');
                }
            };
            reader.readAsText(file);
        } else {
            alert('请选择一个有效的 JSON 文件');
        }
    });
});