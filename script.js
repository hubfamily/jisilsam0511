// DOM 요소 선택
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTask');
const taskList = document.getElementById('taskList');

// 로컬 스토리지에서 할 일 목록 가져오기
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 축하 메시지 표시 함수
function showCongratulations() {
    if (todos.length > 0 && todos.every(todo => todo.completed)) {
        Swal.fire({
            title: '🎉 축하합니다! 🎉',
            html: `
                <div class="mt-4">
                    <p class="text-lg mb-2">모든 할 일을 완료하셨네요!</p>
                    <p class="text-lg">정말 대단해요! 😊</p>
                </div>
            `,
            icon: 'success',
            confirmButtonText: '감사합니다',
            confirmButtonColor: '#3B82F6',
            timer: 3000,
            timerProgressBar: true,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }
}

// 할 일 목록 화면에 표시
function renderTodos() {
    taskList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="form-checkbox" ${todo.completed ? 'checked' : ''}>
            <span>${todo.text}</span>
            <button class="delete-btn">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        `;

        // 체크박스 이벤트 리스너
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTodo(index));

        // 삭제 버튼 이벤트 리스너
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => confirmDelete(index));

        taskList.appendChild(li);
    });

    // 로컬 스토리지 업데이트
    localStorage.setItem('todos', JSON.stringify(todos));
    
    // 할 일 완료 상태 확인 및 축하 메시지 표시
    showCongratulations();
}

// 새로운 할 일 추가
function addTodo() {
    const text = taskInput.value.trim();
    if (text) {
        todos.push({
            text: text,
            completed: false
        });
        taskInput.value = '';
        renderTodos();

        // 추가 완료 토스트 메시지
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: '새로운 할 일이 추가되었습니다!',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
        });
    }
}

// 할 일 완료/미완료 토글
function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();

    // 완료/미완료 토스트 메시지
    if (todos[index].completed) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: '할 일을 완료했습니다! 👏',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
        });
    }
}

// 할 일 삭제 확인
function confirmDelete(index) {
    Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: '이 작업은 되돌릴 수 없습니다!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteTodo(index);
        }
    });
}

// 할 일 삭제
function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();

    // 삭제 완료 토스트 메시지
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: '할 일이 삭제되었습니다',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
    });
}

// 이벤트 리스너 등록
addTaskButton.addEventListener('click', addTodo);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// 초기 할 일 목록 렌더링
renderTodos();
