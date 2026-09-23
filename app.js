/* =====================================================
   BOT HOSTING PANEL
   Frontend Project Manager
===================================================== */


/* =====================================================
   STORAGE
===================================================== */

const STORAGE_KEY = "bothost_projects";


function getProjects() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

    } catch (error) {

        console.error(error);

        return [];

    }

}


function saveProjects(projects) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projects)
    );

}


/* =====================================================
   PROJECT TYPES
===================================================== */

const PROJECT_TYPES = {

    discord: {
        name: "Discord Bot",
        icon: "🤖"
    },

    node: {
        name: "Node.js App",
        icon: "🟢"
    },

    python: {
        name: "Python Bot",
        icon: "🐍"
    },

    web: {
        name: "Web App",
        icon: "🌐"
    },

    docker: {
        name: "Docker",
        icon: "🐳"
    }

};


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showSection(sectionId, button) {

    document
        .querySelectorAll(".section")
        .forEach(section => {

            section.classList.remove(
                "active-section"
            );

        });


    const section =
        document.getElementById(sectionId);


    if (section) {

        section.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    const title =
        document.getElementById("pageTitle");

    const description =
        document.getElementById("pageDescription");


    if (sectionId === "dashboard") {

        title.textContent = "Dashboard";

        description.textContent =
            "Manage your hosted bots and applications.";

    }


    if (sectionId === "projects") {

        title.textContent = "My Bots";

        description.textContent =
            "Manage all your projects.";

        renderAllProjects();

    }

}


/* =====================================================
   CREATE MODAL
===================================================== */

function openCreateModal() {

    const modal =
        document.getElementById("createModal");

    const nameInput =
        document.getElementById("projectName");

    const typeInput =
        document.getElementById("projectType");

    const error =
        document.getElementById("createError");


    modal.classList.add("active");

    error.textContent = "";

    nameInput.value = "";

    typeInput.value = "";

    setTimeout(() => {

        nameInput.focus();

    }, 100);

}


function closeCreateModal() {

    document
        .getElementById("createModal")
        .classList.remove("active");

}


/* =====================================================
   CREATE PROJECT
===================================================== */

function createProject() {

    const nameInput =
        document.getElementById("projectName");

    const typeInput =
        document.getElementById("projectType");

    const error =
        document.getElementById("createError");


    const name =
        nameInput.value.trim();

    const type =
        typeInput.value;


    /* NAME CHECK */

    if (!name) {

        error.textContent =
            "⚠️ Please enter a bot/project name.";

        nameInput.focus();

        return;

    }


    /* TYPE CHECK */

    if (!type) {

        error.textContent =
            "⚠️ Please select a project type.";

        typeInput.focus();

        return;

    }


    /* NAME LENGTH */

    if (name.length < 2) {

        error.textContent =
            "⚠️ Name must contain at least 2 characters.";

        return;

    }


    /* PROJECT */

    const projects =
        getProjects();


    const project = {

        id:
            Date.now().toString(),

        name:
            name,

        type:
            type,

        status:
            "stopped",

        created:
            new Date().toISOString(),

        uptime:
            0,

        logs: [

            `[SYSTEM] ${name} created successfully.`,

            `[SYSTEM] Project type: ${PROJECT_TYPES[type].name}`,

            `[SYSTEM] Waiting for backend connection...`

        ]

    };


    projects.unshift(project);


    saveProjects(projects);


    closeCreateModal();


    renderProjects();

    updateStats();


    showToast(
        "✓",
        `${name} created successfully`
    );


    /* OPEN PROJECTS */

    setTimeout(() => {

        const projectSection =
            document.getElementById("projects");

        if (projectSection) {

            document
                .querySelectorAll(".section")
                .forEach(section => {

                    section.classList.remove(
                        "active-section"
                    );

                });

            projectSection.classList.add(
                "active-section"
            );

            document
                .querySelectorAll(".nav-item")
                .forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });

            document
                .querySelectorAll(".nav-item")[1]
                .classList.add("active");

            document.getElementById(
                "pageTitle"
            ).textContent = "My Bots";

            document.getElementById(
                "pageDescription"
            ).textContent =
                "Manage all your projects.";

            renderAllProjects();

        }

    }, 300);

}


/* =====================================================
   RENDER PROJECTS
===================================================== */

function renderProjects() {

    const projects =
        getProjects();


    const container =
        document.getElementById(
            "dashboardProjects"
        );


    if (!container) return;


    if (projects.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🤖
                </div>

                <h3>No bots yet</h3>

                <p>
                    Create your first bot to get started.
                </p>

                <button onclick="openCreateModal()">
                    + Create Bot
                </button>

            </div>

        `;

        return;

    }


    container.innerHTML =
        projects
            .slice(0, 6)
            .map(projectCard)
            .join("");

}


function renderAllProjects() {

    const projects =
        getProjects();


    const container =
        document.getElementById(
            "allProjects"
        );


    if (!container) return;


    if (projects.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🤖
                </div>

                <h3>No bots yet</h3>

                <p>
                    Create your first project.
                </p>

                <button onclick="openCreateModal()">
                    + Create Bot
                </button>

            </div>

        `;

        return;

    }


    container.innerHTML =
        projects
            .map(projectCard)
            .join("");

}


/* =====================================================
   PROJECT CARD
===================================================== */

function projectCard(project) {

    const type =
        PROJECT_TYPES[project.type] ||
        PROJECT_TYPES.discord;


    const running =
        project.status === "running";


    return `

        <div class="project-card">

            <div class="project-top">

                <div class="project-info">

                    <div class="project-icon">
                        ${type.icon}
                    </div>

                    <div>

                        <div class="project-name">
                            ${escapeHTML(project.name)}
                        </div>

                        <div class="project-type">
                            ${type.name}
                        </div>

                    </div>

                </div>


                <div class="
                    project-status
                    ${running ? "running" : "stopped"}
                ">

                    <span class="project-status-dot"></span>

                    ${running ? "Running" : "Stopped"}

                </div>

            </div>


            <div class="project-actions">

                <button
                    class="start"
                    onclick="toggleProject('${project.id}')"
                >
                    ${running ? "⏹ Stop" : "▶ Start"}
                </button>


                <button
                    onclick="restartProject('${project.id}')"
                >
                    🔄 Restart
                </button>


                <button
                    onclick="openProjectDetails('${project.id}')"
                >
                    ⚙ Manage
                </button>

            </div>

        </div>

    `;

}


/* =====================================================
   START / STOP
===================================================== */

function toggleProject(id) {

    const projects =
        getProjects();


    const project =
        projects.find(
            item => item.id === id
        );


    if (!project) return;


    if (project.status === "running") {

        project.status = "stopped";

        project.logs.unshift(
            `[SYSTEM] ${project.name} stopped.`
        );

        showToast(
            "⏹",
            `${project.name} stopped`
        );

    } else {

        project.status = "running";

        project.logs.unshift(
            `[SYSTEM] ${project.name} started.`
        );

        showToast(
            "▶",
            `${project.name} started`
        );

    }


    saveProjects(projects);


    renderProjects();

    renderAllProjects();

    updateStats();

}


/* =====================================================
   RESTART
===================================================== */

function restartProject(id) {

    const projects =
        getProjects();


    const project =
        projects.find(
            item => item.id === id
        );


    if (!project) return;


    project.status = "running";


    project.logs.unshift(
        `[SYSTEM] ${project.name} restarted.`
    );


    saveProjects(projects);


    renderProjects();

    renderAllProjects();

    updateStats();


    showToast(
        "🔄",
        `${project.name} restarted`
    );

}


/* =====================================================
   PROJECT DETAILS
===================================================== */

function openProjectDetails(id) {

    const projects =
        getProjects();


    const project =
        projects.find(
            item => item.id === id
        );


    if (!project) return;


    const type =
        PROJECT_TYPES[project.type];


    const logs =
        project.logs
            .slice(0, 10)
            .map(log =>
                escapeHTML(log)
            )
            .join("<br>");


    const content =
        document.getElementById(
            "detailsContent"
        );


    content.innerHTML = `

        <div class="detail-header">

            <div class="detail-icon">
                ${type.icon}
            </div>

            <div>

                <h2>
                    ${escapeHTML(project.name)}
                </h2>

                <p>
                    ${type.name}
                </p>

            </div>

        </div>


        <div class="detail-section">

            <h4>STATUS</h4>

            <div class="
                project-status
                ${project.status === "running"
                    ? "running"
                    : "stopped"}
            ">

                <span class="project-status-dot"></span>

                ${project.status === "running"
                    ? "Running"
                    : "Stopped"}

            </div>

        </div>


        <div class="detail-section">

            <h4>PROJECT ID</h4>

            <div class="detail-code">
                ${project.id}
            </div>

        </div>


        <div class="detail-section">

            <h4>LOGS</h4>

            <div class="detail-code">
                ${logs || "No logs yet."}
            </div>

        </div>


        <div class="detail-section">

            <h4>HOSTING</h4>

            <div style="color:#9297a7;font-size:11px;line-height:1.7">

                Frontend project created successfully.

                <br><br>

                Backend server is required to
                actually execute this bot.

            </div>

        </div>


        <button
            class="modal-create"
            onclick="deleteProject('${project.id}')"
            style="
                background:#2a1016;
                color:#ff4d67;
                margin-top:5px;
            "
        >
            🗑 Delete Project
        </button>

    `;


    document
        .getElementById("detailsModal")
        .classList.add("active");

}


function closeDetailsModal() {

    document
        .getElementById("detailsModal")
        .classList.remove("active");

}


/* =====================================================
   DELETE
===================================================== */

function deleteProject(id) {

    const projects =
        getProjects();


    const project =
        projects.find(
            item => item.id === id
        );


    if (!project) return;


    const confirmed =
        confirm(
            `Delete "${project.name}"?`
        );


    if (!confirmed) return;


    const newProjects =
        projects.filter(
            item => item.id !== id
        );


    saveProjects(newProjects);


    closeDetailsModal();


    renderProjects();

    renderAllProjects();

    updateStats();


    showToast(
        "🗑",
        `${project.name} deleted`
    );

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStats() {

    const projects =
        getProjects();


    const total =
        projects.length;


    const running =
        projects.filter(
            project =>
                project.status === "running"
        ).length;


    const stopped =
        total - running;


    const totalElement =
        document.getElementById(
            "totalProjects"
        );


    const runningElement =
        document.getElementById(
            "runningProjects"
        );


    const stoppedElement =
        document.getElementById(
            "stoppedProjects"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (runningElement) {

        runningElement.textContent =
            running;

    }


    if (stoppedElement) {

        stoppedElement.textContent =
            stopped;

    }

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(icon, message) {

    const toast =
        document.getElementById("toast");


    const toastIcon =
        document.getElementById("toastIcon");


    const toastMessage =
        document.getElementById("toastMessage");


    toastIcon.textContent =
        icon;


    toastMessage.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2800);

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* =====================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
===================================================== */

window.addEventListener(
    "click",
    function(event) {

        const createModal =
            document.getElementById(
                "createModal"
            );


        const detailsModal =
            document.getElementById(
                "detailsModal"
            );


        if (event.target === createModal) {

            closeCreateModal();

        }


        if (event.target === detailsModal) {

            closeDetailsModal();

        }

    }
);


/* =====================================================
   ESC KEY
===================================================== */

window.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeCreateModal();

            closeDetailsModal();

        }

    }
);


/* =====================================================
   ENTER KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            document
                .getElementById("createModal")
                .classList
                .contains("active")
        ) {

            createProject();

        }

    }
);


/* =====================================================
   INITIAL LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderProjects();

        renderAllProjects();

        updateStats();

    }
);
