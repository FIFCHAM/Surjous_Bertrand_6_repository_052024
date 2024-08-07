

// ------------------- Les variables
const gallery = document.querySelector('.gallery ');
// console.log(gallery);
const filternav = document.querySelector('#filter-nav');
const projetitle = document.querySelector('#project-title')


// console.log(containermodalAddphoto);
const closemodalbtn = document.querySelector('.fa-xmark');
// console.log(closemodalbtn);
const headerbanner = document.querySelector('#banner-editmode');
const login = document.querySelectorAll('li');
const btnnavlogin = login[2];
// console.log(token);
const token = localStorage.getItem('token');



async function init() {


    const connected = token ? true : false;

    if (connected) {

        const works = await getWorks()
        loopGalleryworks(works)
        galleryWorksmodal(works)
        bannerEdit()
        openModal()
        closeModal()
        logOut()
        modalAddphoto()

    }
    else {

        const works = await getWorks()
        loopGalleryworks(works)


        const categories = await getCategory()
        galleryCategory(categories)
        filterProjects(works)
        logIn()
    }

}
init()

//------------------- Se diriger vers page deconnexion ----------------------
function logIn() {
    btnnavlogin.addEventListener('click', function (e) {
        e.preventDefault()
        // console.log(e);
        window.location.href = "../login.html"
    });
};
function logOut() {
    btnnavlogin.textContent = 'logout'
    btnnavlogin.addEventListener('click', function (e) {
        e.preventDefault()
        // console.log(e);
        window.localStorage.removeItem('token');
        window.location.href = "../index.html"


    });
};

//-------------------- recupérations des travaux dans l'API 
async function getWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    return reponse.json()

}

//---------------------- récupérations des categories dans l'API
async function getCategory() {

    const reponse = await fetch('http://localhost:5678/api/categories');

    return reponse.json();
}


//------------- creation des projets dans le DOM 
async function loopGalleryworks(works) {

    works.forEach(work => {

        galleryWorks(work)

    });

}
async function galleryWorks(work) {
    const figure =
        ` <figure class="figure-work" data-id="${work.id}">
        <img src=${work.imageUrl} alt="${work.title}">
        <figcaption>${work.title}</figcaption>
        </figure>                                             `
    gallery.insertAdjacentHTML("beforeend", figure);

}


//--------------- creation des categories dans le DOM

async function galleryCategory(categories) {

    const itemall = `<li class="filter-item" id="0" name="Tous">Tous</li>`
    filternav.insertAdjacentHTML("beforeend", itemall);
    categories.forEach(category => {
        const filteritem =
            ` <ul id="filterproject" >
            <li class="filter-item" id="${category.id}">

            ${category.name}
            </li>	
				</ul>  `;
        


        filternav.insertAdjacentHTML("beforeend", filteritem);
        // console.log(category);

    });

}

// ------------------- creation du filtre des projets
async function filterProjects(works) {
    //const allWorks = await getWorks();
    const btnfilter = document.querySelectorAll('.filter-item');
    // console.log(btnfilter);
    btnfilter[0].classList.add('filter-itemactive')
    btnfilter.forEach(e => {
        e.addEventListener('click', function () {
            // ------------------- changer la class des buttons ------------
            btnfilter.forEach(btn => btn.classList.remove('filter-itemactive'));
            e.classList.add('filter-itemactive');


            // --------------------- afficher les projets par categories
            gallery.innerHTML = "";
            if (e.id !== "0") {
                const filtercategoryworks = works.filter((work) => work.category.id == e.id);
                filtercategoryworks.forEach((work) => {


                    galleryWorks(work)
                })
            }
            else {
                // loopGalleryworks(works)
                loopGalleryworks(works)
            }
        });
    });
}

//------------------------- admin mode ------------------------------

//-------------------------- modale-------------------------
const modalgallery = document.querySelector('.modal-gallery');
const containermodal = document.querySelector('#container-modal');
const modal = document.querySelector('.modal');

async function galleryWorksmodal(works) {
    //modalgallery.innerHTML="";

    works.forEach(work => {

        const figuremodal =
            ` <figure class="figure-modal" data-id="${work.id}">
        <img src=${work.imageUrl} alt="${work.title}">
        <i class="fa-solid fa-trash-can" data-id="${work.id}"></i>
        </figure>                                             `
        modalgallery.insertAdjacentHTML("beforeend", figuremodal);

    });
    deleTeproject()

}
//------------------  delete project ----------------------------

async function deleTeproject() {

    const figures = document.querySelectorAll(".figure-work");

    const trashbtn = document.querySelectorAll('.fa-trash-can');
    // console.log(trashbtn);
    trashbtn.forEach(el => {
        el.addEventListener('click', async (e) => {
            e.preventDefault();
            const trash = e.target.dataset.id;

            const parentremove = e.target.offsetParent;


            const response = await fetch('http://localhost:5678/api/works/' + trash, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
            })

            if (response.ok) {
                figures.forEach(element => {

                    if (element.dataset.id == trash) {

                        element.remove()
                    }
                });
                parentremove.remove()
            }

            else {
                throw new Error('Erreur de la requête : ' + response.statusText);
            }

        })
    })

}


//------------------ creation de la banniere edit-mode-------
function bannerEdit() {
    headerbanner.classList.add('banner-editmode')
    const modeedit = `<i class="fa-regular fa-pen-to-square">
                        <p>Mode édition</p>
                        </i>`;
    headerbanner.insertAdjacentHTML("beforeend", modeedit)


}

//----------- creation du btn ouverture de la modale-------------

function openModal() {
    const editbtn = `<a class="edit-btn" >
                    <i class="fa-regular fa-pen-to-square">
                        <p>modifier</p>
                        </i>
                    </a>`;
    projetitle.insertAdjacentHTML("beforeend", editbtn);

    const btnmodal = document.querySelector(".edit-btn");


    btnmodal.addEventListener('click', function () {
        containermodal.style.display = 'flex';
        modal.style.display = 'flex';
        containermodalAddphoto.style.display = 'none'

    });
};


//------------------- close modal ----------------------------
function closeModal() {
    closemodalbtn.addEventListener('click', function () {
        containermodal.style.display = 'none'
    });
    containermodal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.style.display = 'none';
            containermodalAddphoto.innerHTML = '';

            modalAddphoto()
        }

    });
};
//--------------------- open modal add-photo-----------------
function btnmodalegalleryAddphto() {

    const btnopenmodalAddphoto = document.querySelector('#container-modal button')
    //  console.log(btnopenmodalAddphoto); 
    btnopenmodalAddphoto.addEventListener('click', function () {
        modal.style.display = 'none';
        containermodalAddphoto.style.display = 'block'
        
    })
}

//------------------------ creation modal add-photo---------------
const containermodalAddphoto = document.querySelector('.container-add-photo');
async function modalAddphoto() {
    const category = await getCategory()

    const ajoutphoto = `<div class="add-photo">
      <i class="fa-solid fa-arrow-left"></i>
	<i class="fa-solid fa-xmark" type"reset"></i>
	<h3>Ajout photo</h3>
    <form id="addphoto-form">
	<div class="photo-container">
		<i class="fa-regular fa-image"></i>
        <label>+ Ajouter photo
		<input type="file" name="file" id="photo-file" accept="image/*">
        </label>
		<p>jpg, png : 4mo max</p>
	</div>
	<div class="form-add" >
		<label for="title">Titre</label>
		<input type="text" name="photo-title" id="photo-title" >
		<label for="Catégorie">Catégorie</label>
		<select name="Catégories" id="photo-categorie">
			<option value=${category[0].id} >"${category[0].name}"</option>
			<option value=${category[1].id} >"${category[1].name}"</option>
			<option value=${category[2].id} >"${category[2].name}"</option>
            </select> 
            <hr>
            <button   id="validphoto"  >Valider</button>
            </div>
            </form>
</div>
`;
    containermodalAddphoto.insertAdjacentHTML("beforeend", ajoutphoto)

    btnmodalegalleryAddphto()
    returnModaldelete()
    closeAllmodals()
    checkInput()
    addPhoto()
    photoInput()

}



//------------------------- revenir sur modale suppression photo--------------
function showInitialModal() {
    modal.style.display = 'flex'
        containermodalAddphoto.style.display = 'none'
        containermodalAddphoto.innerHTML = '';

        //modalAddphoto()
    
}
function returnModaldelete() {
    const returnmodal = document.querySelector('.fa-arrow-left')
    returnmodal.addEventListener('click', function () {
        showInitialModal()
        modalAddphoto()

    })

}
function closeAllmodals() {
    const closemodals = document.querySelector('.add-photo .fa-xmark')
    closemodals.addEventListener('click', function () {
        containermodal.style.display = 'none';
        containermodalAddphoto.style.display = 'none';
        modal.style.display = 'flex';
        containermodalAddphoto.innerHTML = '';

        modalAddphoto()


    })

}
//--------------------- ajout de nouveau projet ----------

//--------------------- verifier si l'utilisateur remplis le formulaire----
function checkInput() {
    const addphotoform = document.querySelector('#addphoto-form');
    const photofile = document.getElementById('photo-file');
    const phototitle = document.getElementById('photo-title');
    const photocategorie = document.querySelector('#photo-categorie');
    const btnvalidphoto = document.getElementById('validphoto');

    addphotoform.addEventListener('input', function () {

        if (photofile.value !== "" && phototitle.value !== "" && photocategorie.value !== "") {

            //btnvalidphoto.disabled = false
            btnvalidphoto.style.background = 'green'
            return
        }
         //btnvalidphoto.disabled = true
            //btnvalidphoto.style.background = '#a7a7a7'
    })
}

async function addPhoto() {
    const photofile = document.getElementById('photo-file');
    const phototitle = document.getElementById('photo-title');
    const photocategorie = document.querySelector('#photo-categorie');
    const btnvalidphoto = document.getElementById('validphoto');
    const addphotoform = document.querySelector('#addphoto-form');


    addphotoform.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Vérifier si tout est rempli
if(photofile.value === ""){
    alert("Veuillez ajouter une photo")
    return
}

if(phototitle.value === ""){
    alert("Veuillez ajouter un titre")
    return
}

if(photocategorie.value === ""){
    alert("Veuillez ajouter une catégorie")
    return
}
        const formData = new FormData(addphotoform);
        formData.append('image', photofile.files[0]);
        formData.append('title', phototitle.value);
        formData.append('category', photocategorie.value);



        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            },
            body: formData,
        })

        if (response.ok) {

            const newwork = await response.json();

            newimgGallery(newwork)
            newimgmodalGallery(newwork)
            newPreviewimg()
            showInitialModal()
            

        }
        else {
            alert("veuillez remplir tous les champs");
            throw new Error('Erreur de la requête : ' + response.statusText);
        }


    })
    //---------------------- create img preview -----------------------   
}
function photoInput() {
    const photocontainer = document.querySelector('.photo-container');
    const labelfile = document.querySelector(".photo-container label");
    const iconfile = document.querySelector(".photo-container i");
    const pfile = document.querySelector(".photo-container p");
    const imgfile = document.querySelector('#photo-file')
    imgfile.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgsource = e.target.result;
                const img = `<img src="${imgsource}" alt="Image sélectionnée">`
                //labelfile.style.display='none';
                // iconfile.style.display='none';
                //file.style.display='none';
                photocontainer.innerHTML = ''
                photocontainer.insertAdjacentHTML('afterbegin', img);

            }
            reader.readAsDataURL(file);

        }

    })
}
//----------------------------------- add photo but no reload the page -----------
function newPreviewimg() {
    const containermodalAddphoto = document.querySelector('.container-add-photo');
    containermodalAddphoto.innerHTML = '';

    modalAddphoto()

    /*const photocontainer = document.querySelector('.photo-container');
    photocontainer.innerHTML='';
    console.log(photocontainer);
    //const newimg = document.querySelector('.photocontainer img')
    const newpreviewimg = 
    `<i class="fa-regular fa-image"></i>
    <label>+ Ajouter photo
    <input type="file" name="file" id="photo-file" accept="image/*">
    </label>
     <p>jpg, png : 4mo max</p
     
     ` 
     photocontainer.insertAdjacentHTML('afterbegin',newpreviewimg)*/




}

//-------------------------   display new projet modalgallery-------------------- 
async function newimgmodalGallery(work) {
    const newfiguremodal =
        ` <figure class="figure-modal" data-id="${work.id}">
    <img src=${work.imageUrl} alt="${work.title}">
    <i class="fa-solid fa-trash-can" data-id="${work.id}"></i>
    </figure>                                             `
    modalgallery.insertAdjacentHTML("beforeend", newfiguremodal)

    deleTeproject()
}

//------------------------------- display new projet gallery-----------
async function newimgGallery(work) {
    const newfigure =
        ` <figure class="figure-work" data-id="${work.id}">
        <img src=${work.imageUrl} alt="${work.title}">
        <figcaption>${work.title}</figcaption>
        </figure>                                             `
    gallery.insertAdjacentHTML("beforeend", newfigure);
}