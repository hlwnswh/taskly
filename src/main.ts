
import './style.css'

// ================================
// 1. TYPE ALIAS DAN UNION TYPE
// ================================

type TaskStatus = 'Belum Selesai' | 'Selesai'
type TaskFilter = 'Semua' | 'Belum Selesai' | 'Selesai'

// ================================
// 2. INTERFACE
// ================================

interface Task {
  id: number
  title: string
  course: string
  deadline: string
  completed: boolean
}

// ================================
// 3. GENERICS
// ================================

function loadData<T>(key: string, fallback: T): T {
  const saved = localStorage.getItem(key)

  if (saved) {
    try {
      return JSON.parse(saved) as T
    } catch {
      return fallback
    }
  }

  return fallback
}

// ================================
// 4. ARRAY DAN PRIMITIVE TYPES
// ================================

let tasks: Task[] = loadData<Task[]>('taskly-tasks', [])

let currentFilter: TaskFilter = 'Semua'
let editingId: number | null = null

const appName: string = import.meta.env.VITE_APP_NAME || 'TASKLY'
const appVersion: string = import.meta.env.VITE_APP_VERSION || '1.0.0'
const isAppReady: boolean = true

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Elemen aplikasi tidak ditemukan!')
}

// ================================
// 5. FUNGSI PENYIMPANAN
// ================================

function saveTasks(): void {
  localStorage.setItem('taskly-tasks', JSON.stringify(tasks))
}

// ================================
// 6. FUNGSI FORMAT TANGGAL
// ================================

function formatDate(date: string): string {
  if (!date) return '-'

  return new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// ================================
// 7. FUNGSI KEAMANAN TEKS
// ================================

function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }

    return entities[char]
  })
}

// ================================
// 8. TAMPILAN APLIKASI
// ================================

function renderApp(): void {
  const total = tasks.length
  const completed = tasks.filter(task => task.completed).length
  const pending = total - completed

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'Selesai') return task.completed
    if (currentFilter === 'Belum Selesai') return !task.completed
    return true
  })

  app!.innerHTML = `
    <div class="app-layout">

      <aside class="sidebar">
        <div class="brand">
          <div class="brand-icon">✿</div>
          <div>
            <h2>${escapeHTML(appName)}</h2>
            <span>College Task Manager</span>
          </div>
        </div>

        <div class="sidebar-menu">
          <p class="menu-label">MENU UTAMA</p>

          <button class="menu-item active" data-filter="Semua">
            <span>⌂</span> Dashboard
          </button>

          <button class="menu-item" data-filter="Belum Selesai">
            <span>◷</span> Belum Selesai
          </button>

          <button class="menu-item" data-filter="Selesai">
            <span>✓</span> Selesai
          </button>
        </div>

        <div class="sidebar-bottom">
          <div class="sidebar-note">
            <span>🌷</span>
            <p>Small steps every day lead to big results.</p>
          </div>
          <span class="version">Version ${escapeHTML(appVersion)}</span>
        </div>
      </aside>

      <main class="main-content">

        <header class="topbar">
          <div>
            <span class="date-label">MY PERSONAL SPACE</span>
            <h1>My Dashboard <span>✿</span></h1>
            <p>Atur tugas kuliahmu, satu per satu.</p>
          </div>

          <div class="profile">
            <div class="profile-icon">H</div>
            <span>My Planner</span>
          </div>
        </header>

        <section class="welcome-card">
          <div>
            <span class="welcome-label">HELLO, STUDENT! ♡</span>
            <h2>Make today<br>count beautifully.</h2>
            <p>Jangan lupa, setiap tugas yang selesai adalah satu langkah menuju tujuanmu.</p>
          </div>
          <div class="welcome-decoration">✿</div>
        </section>

        <section class="stats-grid">

          <div class="stat-card">
            <span class="stat-icon pink">▤</span>
            <p>Total Tugas</p>
            <h2>${total}</h2>
            <span class="stat-caption">Semua tugas kuliah</span>
          </div>

          <div class="stat-card">
            <span class="stat-icon peach">◷</span>
            <p>Belum Selesai</p>
            <h2>${pending}</h2>
            <span class="stat-caption">Perlu dikerjakan</span>
          </div>

          <div class="stat-card">
            <span class="stat-icon green">✓</span>
            <p>Selesai</p>
            <h2>${completed}</h2>
            <span class="stat-caption">Berhasil diselesaikan</span>
          </div>

        </section>

        <section class="tasks-section">

          <div class="section-heading">
            <div>
              <span class="date-label">YOUR ACTIVITIES</span>
              <h2>Daftar Tugas <span>♡</span></h2>
              <p>Semua pekerjaan kuliahmu ada di sini.</p>
            </div>

            <button class="add-button" id="add-task">
              + Tambah Tugas
            </button>
          </div>

          <div class="filter-tabs">
            ${(['Semua', 'Belum Selesai', 'Selesai'] as TaskFilter[]).map(filter => `
              <button
                class="filter-button ${currentFilter === filter ? 'selected' : ''}"
                data-filter="${filter}"
              >
                ${filter}
              </button>
            `).join('')}
          </div>

          <div class="task-list">

            ${filteredTasks.length === 0 ? `
              <div class="empty-state">
                <span>🌷</span>
                <h3>Belum ada tugas di sini</h3>
                <p>Tambahkan tugas kuliahmu dan mulai atur aktivitasmu.</p>
              </div>
            ` : filteredTasks.map(task => {
              const status: TaskStatus = task.completed
                ? 'Selesai'
                : 'Belum Selesai'

              return `
                <article class="task-card ${task.completed ? 'completed' : ''}">

                  <button
                    class="check-button ${task.completed ? 'checked' : ''}"
                    data-action="toggle"
                    data-id="${task.id}"
                    aria-label="Ubah status tugas"
                  >
                    ${task.completed ? '✓' : ''}
                  </button>

                  <div class="task-information">
                    <h3>${escapeHTML(task.title)}</h3>
                    <p>${escapeHTML(task.course)}</p>
                    <span class="deadline">◷ ${formatDate(task.deadline)}</span>
                  </div>

                  <div class="task-actions">
                    <span class="status ${task.completed ? 'done' : 'pending'}">
                      ${status}
                    </span>

                    <button class="action-button"
                      data-action="edit" data-id="${task.id}">
                      Edit
                    </button>

                    <button class="action-button delete"
                      data-action="delete" data-id="${task.id}">
                      Hapus
                    </button>
                  </div>

                </article>
              `
            }).join('')}

          </div>
        </section>

        <footer class="footer">
          Made with ♡ for your better study days.
        </footer>

      </main>
    </div>

    <div class="modal-overlay" id="task-modal">
      <div class="modal-card">

        <div class="modal-heading">
          <div>
            <span class="date-label">TASK MANAGEMENT</span>
            <h2 id="modal-title">Tambah Tugas ✿</h2>
          </div>
          <button class="close-button" id="close-modal">×</button>
        </div>

        <form id="task-form">

          <label for="task-title">Nama Tugas</label>
          <input id="task-title" type="text"
            placeholder="Contoh: Membuat laporan praktikum"
            required maxlength="100">

          <label for="task-course">Mata Kuliah</label>
          <input id="task-course" type="text"
            placeholder="Contoh: Pemrograman Web"
            required maxlength="80">

          <label for="task-deadline">Deadline</label>
          <input id="task-deadline" type="date" required>

          <div class="modal-buttons">
            <button type="button" class="cancel-button" id="cancel-modal">
              Batal
            </button>
            <button type="submit" class="save-button">
              Simpan Tugas
            </button>
          </div>

        </form>
      </div>
    </div>
  `

  attachEvents()
}

// ================================
// 9. FUNGSI EVENT APLIKASI
// ================================

function attachEvents(): void {
  const modal = document.querySelector<HTMLDivElement>('#task-modal')
  const form = document.querySelector<HTMLFormElement>('#task-form')

  document.querySelectorAll<HTMLButtonElement>('[data-filter]')
    .forEach(button => {
      button.addEventListener('click', () => {
        currentFilter = button.dataset.filter as TaskFilter
        renderApp()
      })
    })

  document.querySelector('#add-task')?.addEventListener('click', () => {
    editingId = null
    form?.reset()

    const title = document.querySelector('#modal-title')
    if (title) title.textContent = 'Tambah Tugas ✿'

    modal?.classList.add('show')
  })

  const closeModal = (): void => {
    modal?.classList.remove('show')
    editingId = null
  }

  document.querySelector('#close-modal')?.addEventListener('click', closeModal)
  document.querySelector('#cancel-modal')?.addEventListener('click', closeModal)

  modal?.addEventListener('click', event => {
    if (event.target === modal) closeModal()
  })

  form?.addEventListener('submit', event => {
    event.preventDefault()

    const title = document.querySelector<HTMLInputElement>('#task-title')!
    const course = document.querySelector<HTMLInputElement>('#task-course')!
    const deadline = document.querySelector<HTMLInputElement>('#task-deadline')!

    const taskData = {
      title: title.value.trim(),
      course: course.value.trim(),
      deadline: deadline.value
    }

    if (!taskData.title || !taskData.course || !taskData.deadline) return

    if (editingId !== null) {
      tasks = tasks.map(task =>
        task.id === editingId
          ? { ...task, ...taskData }
          : task
      )
    } else {
      const newTask: Task = {
        id: Date.now(),
        ...taskData,
        completed: false
      }

      tasks.push(newTask)
    }

    saveTasks()
    closeModal()
    renderApp()
  })

  document.querySelectorAll<HTMLButtonElement>('[data-action]')
    .forEach(button => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.id)
        const action = button.dataset.action

        if (action === 'toggle') {
          tasks = tasks.map(task =>
            task.id === id
              ? { ...task, completed: !task.completed }
              : task
          )
        }

        if (action === 'delete') {
          if (!confirm('Yakin ingin menghapus tugas ini?')) return
          tasks = tasks.filter(task => task.id !== id)
        }

        if (action === 'edit') {
          const task = tasks.find(item => item.id === id)
          if (!task) return

          editingId = id

          document.querySelector<HTMLInputElement>('#task-title')!.value = task.title
          document.querySelector<HTMLInputElement>('#task-course')!.value = task.course
          document.querySelector<HTMLInputElement>('#task-deadline')!.value = task.deadline

          document.querySelector('#modal-title')!.textContent = 'Edit Tugas ✿'
          modal?.classList.add('show')
          return
        }

        saveTasks()
        renderApp()
      })
    })
}

// ================================
// 10. JALANKAN APLIKASI
// ================================

if (isAppReady) {
  renderApp()
}
