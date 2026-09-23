function openCreateModal() {

    const modal =
        document.getElementById("createModal");

    modal.classList.add("active");

}


function closeCreateModal() {

    const modal =
        document.getElementById("createModal");

    modal.classList.remove("active");

}


/* CREATE PROJECT */

function createProject() {

    const name =
        document
            .getElementById("projectName")
            .value
            .trim();


    const type =
        document
            .getElementById("projectType")
            .value;


    if (!name) {

        alert(
            "⚠️ Please enter a project name."
        );

        return;
    }


    const types = {

        discord: "Discord Bot",

        node: "Node.js App",

        python: "Python Bot",

        web: "Web App",

        docker: "Docker"

    };


    alert(

        "✅ Project Created!\n\n" +

        "Name: " +
        name +

        "\nType: " +
        types[type]

    );


    document
        .getElementById("projectName")
        .value = "";


    closeCreateModal();

}


/* CLOSE MODAL WHEN CLICKING OUTSIDE */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "createModal"
            );


        if (
            event.target === modal
        ) {

            closeCreateModal();

        }

    }
);


/* ESC KEY */

window.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeCreateModal();

        }

    }
);
