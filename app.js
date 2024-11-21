document.addEventListener('DOMContentLoaded', () => {
    const storedLinks = JSON.parse(localStorage.getItem('links')) || [];
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];

    const linkSelector = document.getElementById('link-selector');
    const employeeSelector = document.getElementById('employee-selector');
    const visitBtn = document.getElementById('visit-link');
    
    const manageBtn = document.getElementById('manage-btn'); // 管理按钮
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

    // 更新链接和用户选择框
    function updateSelectors() {
        linkSelector.innerHTML = '';
        employeeSelector.innerHTML = '';

        if (storedLinks.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '请至少添加一条访问链接';
            linkSelector.appendChild(option);
            linkSelector.disabled = true; // 禁用选择框
        } else {
            storedLinks.forEach(link => {
                const option = document.createElement('option');
                option.value = link.name;
                option.textContent = link.name;
                linkSelector.appendChild(option);
            });
            linkSelector.disabled = false; // 启用选择框
        }

        if (storedEmployees.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '请至少添加一位用户及工号';
            employeeSelector.appendChild(option);
            employeeSelector.disabled = true; // 禁用选择框
        } else {
            storedEmployees.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.id;
                option.textContent = `${employee.name} (${employee.id})`;
                employeeSelector.appendChild(option);
            });
            employeeSelector.disabled = false; // 启用选择框
        }

        // 更新[访问]按钮的状态
        updateVisitButtonState();
    }

    // 更新[访问]按钮状态
    function updateVisitButtonState() {
        const isLinkSelected = linkSelector.value !== '';
        const isEmployeeSelected = employeeSelector.value !== '';

        if (isLinkSelected && isEmployeeSelected) {
            visitBtn.disabled = false;
            visitBtn.classList.remove('disabled'); // 移除禁用状态样式
        } else {
            visitBtn.disabled = true;
            visitBtn.classList.add('disabled'); // 添加禁用状态样式
        }
    }

    // 更新链接管理和用户管理列表
    function updateManagementLists() {
        linkList.innerHTML = '';
        userList.innerHTML = '';

        // 更新链接列表
        storedLinks.forEach((link, index) => {
            const item = document.createElement('div');
            item.classList.add('item');
            
            const typeText = link.type === 'plaintext' ? '明文' : '掩码';
            item.innerHTML = `${link.name} - ${link.url} (${typeText})
                <button onclick="deleteLink(${index})">删除</button>`;
            linkList.appendChild(item);
        });

        // 更新用户列表
        storedEmployees.forEach((employee, index) => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `${employee.name} (${employee.id})
                <button onclick="deleteUser(${index})">删除</button>`;
            userList.appendChild(item);
        });
    }

    updateSelectors();
    updateManagementLists();

    // 显示管理菜单并切换子菜单
    manageBtn.addEventListener('click', () => {
        const isVisible = linkSubmenu.style.display === 'block' || userSubmenu.style.display === 'block' || dataSubmenu.style.display === 'block';
        if (isVisible) {
            // 隐藏子菜单并重置所有状态
            linkSubmenu.style.display = 'none';
            userSubmenu.style.display = 'none';
            dataSubmenu.style.display = 'none';
            linkManagement.style.display = 'none';
            userManagement.style.display = 'none';
            dataManagement.style.display = 'none';
            addLinkForm.style.display = 'none';
            addUserForm.style.display = 'none';
            linkNameInput.value = '';
            accessLinkInput.value = '';
            userNameInput.value = '';
            userIdInput.value = '';
        } else {
            // 展开子菜单
            linkSubmenu.style.display = 'block';
            userSubmenu.style.display = 'block';
            dataSubmenu.style.display = 'block';
        }
    });

    // 显示链接管理
    document.getElementById('link-management-btn').addEventListener('click', () => {
        linkManagement.style.display = 'block';
        userManagement.style.display = 'none';
        dataManagement.style.display = 'none';
        addLinkForm.style.display = 'none'; // 默认不显示输入框
        addUserForm.style.display = 'none'; // 隐藏用户输入框
    });

    // 显示用户管理
    document.getElementById('user-management-btn').addEventListener('click', () => {
        userManagement.style.display = 'block';
        linkManagement.style.display = 'none';
        dataManagement.style.display = 'none';
        addUserForm.style.display = 'none'; // 默认不显示输入框
        addLinkForm.style.display = 'none';  // 隐藏链接输入框
    });

    // 显示数据管理
    document.getElementById('data-management-btn').addEventListener('click', () => {
        dataManagement.style.display = 'block';
        linkManagement.style.display = 'none';
        userManagement.style.display = 'none';
        addLinkForm.style.display = 'none'; // 隐藏输入框
        addUserForm.style.display = 'none'; // 隐藏输入框
    });

    // 点击[添加链接]按钮
    addLinkBtn.addEventListener('click', () => {
        addLinkForm.style.display = 'block'; // 显示添加链接表单
    });

    // 点击[添加用户]按钮
    addUserBtn.addEventListener('click', () => {
        addUserForm.style.display = 'block'; // 显示添加用户表单
    });

    // 取消添加链接
    cancelLinkBtn.addEventListener('click', () => {
        addLinkForm.style.display = 'none'; // 隐藏添加链接表单
    });

    // 取消添加用户
    cancelUserBtn.addEventListener('click', () => {
        addUserForm.style.display = 'none'; // 隐藏添加用户表单
    });

    // 保存链接
    saveLinkBtn.addEventListener('click', () => {
        const linkName = linkNameInput.value;
        const accessLink = accessLinkInput.value;
        const usernameType = usernameTypeSelect.value;

        if (!linkName || !accessLink) {
            alert('请填写链接名称和访问链接');
            return;
        }

        storedLinks.push({
            name: linkName,
            url: accessLink,
            type: usernameType
        });

        localStorage.setItem('links', JSON.stringify(storedLinks));
        updateSelectors();
        updateManagementLists();

        // 清空表单
        linkNameInput.value = '';
        accessLinkInput.value = '';
    });

    // 保存用户
    saveUserBtn.addEventListener('click', () => {
        const userName = userNameInput.value;
        const userId = userIdInput.value;

        if (!userName || !userId) {
            alert('请填写姓名和工号');
            return;
        }

        storedEmployees.push({
            name: userName,
            id: userId
        });

        localStorage.setItem('employees', JSON.stringify(storedEmployees));
        updateSelectors();
        updateManagementLists();

        // 清空表单
        userNameInput.value = '';
        userIdInput.value = '';
    });

    // 点击[访问]按钮
    visitBtn.addEventListener('click', () => {
        const selectedLinkName = linkSelector.value;
        const selectedEmployeeId = employeeSelector.value;

        const selectedLink = storedLinks.find(link => link.name === selectedLinkName);
        const selectedEmployee = storedEmployees.find(employee => employee.id === selectedEmployeeId);

        if (!selectedLink || !selectedEmployee) {
            alert('请选择一个链接和一个员工');
            return;
        }

        let visitUrl = selectedLink.url;
        const usernameType = selectedLink.type;

        // 根据用户名类型替换[username]
        if (usernameType === 'masked') {
            // 如果是掩码，使用 Base64 编码工号
            const encodedId = btoa(selectedEmployee.id.toString());  // 将工号转换为 Base64 字符串
            visitUrl = visitUrl.replace('[username]', encodedId); // 替换链接中的[username]字段
        } else {
            // 如果是明文，直接使用工号
            visitUrl = visitUrl.replace('[username]', selectedEmployee.id); // 替换链接中的[username]字段
        }

        window.open(visitUrl, '_blank'); // 打开新标签页访问链接
    });

// 删除链接
window.deleteLink = function(index) {
    // 弹出确认对话框
    const isConfirmed = window.confirm('您确定要删除这个链接吗？');
    if (isConfirmed) {
        // 用户确认删除
        storedLinks.splice(index, 1);
        localStorage.setItem('links', JSON.stringify(storedLinks));
        updateSelectors();
        updateManagementLists();
    }
};

// 删除用户
window.deleteUser = function(index) {
    // 弹出确认对话框
    const isConfirmed = window.confirm('您确定要删除这个用户吗？');
    if (isConfirmed) {
        // 用户确认删除
        storedEmployees.splice(index, 1);
        localStorage.setItem('employees', JSON.stringify(storedEmployees));
        updateSelectors();
        updateManagementLists();
    }
};


    // 导出数据
    document.getElementById('export-data').addEventListener('click', () => {
        const data = {
            links: storedLinks,
            employees: storedEmployees
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json';
        link.click();
        URL.revokeObjectURL(url);
    });

    // 导入数据
    document.getElementById('import-data').addEventListener('click', () => {
        importFileInput.click();
    });

    // 处理导入文件
    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const importedData = JSON.parse(reader.result);
                    if (importedData.links) {
                        storedLinks.length = 0; // 清空当前数据
                        storedLinks.push(...importedData.links); // 导入链接数据
                    }
                    if (importedData.employees) {
                        storedEmployees.length = 0; // 清空当前数据
                        storedEmployees.push(...importedData.employees); // 导入用户数据
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
