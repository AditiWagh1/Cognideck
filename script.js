const saveFlashcardBtn=document.getElementById("saveFlashcardBtn");
const toast=document.getElementById("toast");
const statsDisplay=document.getElementById("statsDisplay");
const flashcardsContainer = document.getElementById("flashcardsContainer");
const studyMode=document.getElementById("studyMode");
const closeStudyBtn=document.getElementById("closeStudy");
const flipStudyCardBtn=document.getElementById("flipStudyCardBtn");

let flashcards=JSON.parse(localStorage.getItem("flashcards")) || [];

saveFlashcardBtn.addEventListener("click",saveFlashcard);
closeStudyBtn.addEventListener("click",closeStudySession);
flipStudyCardBtn.addEventListener("click",flipStudyCard);

updateFlashcardsDisplay();
updateStats();

function saveFlashcard(){
    const title=document.getElementById("flashcardtitle").value.trim();
    const front=document.getElementById("flashcardFront").value.trim();
    const back=document.getElementById("flashcardBack").value.trim();

    if(!title || !front ||!back){
        showToast("Please fill in all the required fields","error");
    }

    const newFlashcard={
        id: Date.now().toString(),
        createdAt:new Date().toISOString(),
       title,
       front,
       back,
    };

    flashcards.push(newFlashcard);
    saveToLocalStorage();
    updateFlashcardsDisplay();
    clearForm();
}

function showToast(message,type = "")
{
    toast.textContent=message;
    toast.className=`toast ${type}`;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    },3000);
}

function saveToLocalStorage(){
    localStorage.setItem("flashcards",JSON.stringify(flashcards));

    updateStats();
}

function clearForm() {
    document.getElementById("flashcardtitle").value="";
    document.getElementById("flashcardFront").value="";
    document.getElementById("flashcardBack").value="";
}

function updateStats(){
    const count=flashcards.length;
    statsDisplay.textContent=`${count} flashcard${count !== 1 ? "s" : ""}`;
}

function updateFlashcardsDisplay() {
    if(flashcards.length===0) {
        flashcardsContainer.innerHTML=`
        <div class="empty-state">
                    <i class="fa-solid fa-layer-group"></i>
                    <h3>No Flashcards Found</h3>
                    <p>Try adjusting a search or create a new Flashcard!</p>
                </div>
        `;

        return;
    }

    flashcardsContainer.innerHTML=""; /*clearing the flashcard container to avoid duplicacy*/

    flashcards.forEach((card)=>{
        const flashcardElement = document.createElement("div");
        flashcardElement.className="flashcard";
        flashcardElement.dataset.id=card.id;

        flashcardElement.innerHTML=`
        <div class="flashcard-content">
            <div class="flashcard-front">
              <h3 class="flashcard-title">${card.title}</h3>
              <p class="flashv=card-body">${card.front}</p>
            </div>
            <div class="flashcard-actions">
            <button class="edit-btn" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
            <button class="study-btn" title="Study"><i class="fa-solid fa-graduation-cap"></i></button>
            </div>
        </div>
        `;

        flashcardsContainer.appendChild(flashcardElement);

        const editBtn=flashcardElement.querySelector(".edit-btn");
        const deleteBtn=flashcardElement.querySelector(".delete-btn");
        const studyBtn=flashcardElement.querySelector(".study-btn");


        editBtn.addEventListener("click",()=>{
            editFlashcard(card.id);
        });
        deleteBtn.addEventListener("click",()=>{
            deleteFlashcard(card.id);           
        });
        studyBtn.addEventListener("click",() =>{
            startStudySession(card);
        })
    });
}

function startStudySession(card){
    studyMode.classList.add("active");
    updateStudyCard(card);
}

function flipStudyCard(){
    studyCard.classList.toggle("flipped");
}

function updateStudyCard(card){
    document.getElementById("studyFrontTitle").textContent=card.title;
    document.getElementById("studyFrontContent").textContent=card.front;
    document.getElementById("studyBackContent").textContent=card.back;
}

function deleteFlashcard(id) {
    if (confirm("Are you sure you want to delete this flashcard")){
        flashcards=flashcards.filter((card)=>card.id!==id);
    }
    saveToLocalStorage();
    updateFlashcardsDisplay();
    showToast("Flashcard deleted","success");
}

function closeStudySession(){
    studyMode.classList.remove("active");
    studyCard.classList.remove("flipped");
}

function editFlashcard(id){
    const cardIndex=flashcards.findIndex((card)=>card.id===id);
    const card=flashcards[cardIndex];
    document.getElementById("flashcardtitle").value=card.title;
    document.getElementById("flashcardFront").value=card.front;
    document.getElementById("flashcardBack").value=card.back;
    flashcards=flashcards.filter((c)=>c.id!==id);
    saveToLocalStorage();
    updateFlashcardsDisplay();
}