onload = todoMain;

function todoMain(){
  let inputElem,
      inputElem2,
      dateInput,
      button,
      sortButton,
      ulElem,
      todoList= [],
      shortlistBtn;

  getElements();
  addListeners();

  load();
  renderRows();

  function getElements(){
    inputElem = document.getElementsByTagName("input")[0];
    inputElem2 = document.getElementsByTagName("input")[1];
    dateInput = document.getElementById("dateInput");
    button = document.getElementById("addBtn");
    sortButton = document.getElementById("sortBtn");
    ulElem = document.getElementsByTagName("ul")[0];
    shortlistBtn=document.getElementById("shortlistBtn");
  }

  function addListeners(){
    button.addEventListener("click", addEntry, false);
    sortButton.addEventListener("click", sortEntry, false);
    shortlistBtn.addEventListener("change", onShortListChange, false);
    document.getElementById("todoTable").addEventListener("click", onTableClicked, false);
  }

  function addEntry(event){

    let inputValue = inputElem.value;
    inputElem.value = "";

    let inputValue2 = inputElem2.value;
    inputElem2.value = "";

    let dateValue=dateInput.value;
    dateInput.value="";

    let obj={
        id : _uuid(),
        todo: inputValue,
        description: inputValue2,
        date: dateValue,
        done: false,
    };

    renderRow(obj);  
    
    todoList.push(obj);

    save();

  }
  function save(){
    let stringified = JSON.stringify(todoList);
    localStorage.setItem("todoList",stringified);
  }

  function load(){
    let retrieved=localStorage.getItem("todoList");
    todoList = JSON.parse(retrieved);
   // console.log(typeof todoList)
    if(todoList==null)
    todoList=[];
  }

  function renderRows(){
   todoList.forEach(todoObj => {
   // let todoEntry = todoObj["todo"];
   // let todoDescription = todoObj.description;
    renderRow(todoObj);
   })
  }

  function renderRow({todo: inputValue, description: inputValue2, id, date, done}){


// add a new row

let table = document.getElementById("todoTable");

let trElem = document.createElement("tr");
table.appendChild(trElem);

// checkbox cell
let checkboxElem = document.createElement("input");
checkboxElem.type = "checkbox";
checkboxElem.addEventListener("click", checkboxClickCallback, false);
checkboxElem.dataset.id = id;
let tdElem1 = document.createElement("td");
tdElem1.appendChild(checkboxElem);
trElem.appendChild(tdElem1);

// date cell
let dateElem = document.createElement("td");
dateElem.innerText = formatDate(date);
trElem.appendChild(dateElem);

// to-do cell
let tdElem2 = document.createElement("td");
tdElem2.innerText = inputValue;
trElem.appendChild(tdElem2);

// description cell
let tdElem3 = document.createElement("td");
tdElem3.innerText = inputValue2;
trElem.appendChild(tdElem3);

// delete cell
let spanElem = document.createElement("span");
spanElem.innerText = "delete";
spanElem.className = "material-icons";
spanElem.addEventListener("click", deleteItem, false);
spanElem.dataset.id = id;
let tdElem4 = document.createElement("td");
tdElem4.appendChild(spanElem);
trElem.appendChild(tdElem4);

checkboxElem.checked=done;
if(done){
    trElem.classList.add("strike"); 
}else{
    trElem.classList.remove("strike"); 
}


//edit cell
dateElem.dataset.editable=true;
tdElem2.dataset.editable=true;
tdElem3.dataset.editable=true;

dateElem.dataset.type="date";
dateElem.dataset.value=date;
tdElem2.dataset.type="todo";
tdElem3.dataset.type="description";

dateElem.dataset.id=id;
tdElem2.dataset.id=id;
tdElem3.dataset.id=id
// tdElem2.addEventListener("dblclick",allowEdit,false);

function deleteItem(){
    trElem.remove();
    for(let i=0;i<todoList.length;i++){
        if(todoList[i].id == this.dataset.id)
        todoList.splice(i, 1);
    }
    save();
  }

  function checkboxClickCallback(){
    trElem.classList.toggle("strike");  
for(let i=0;i<todoList.length;i++){
    if(todoList[i].id == this.dataset.id)
    todoList[i]["done"]=this.checked;
}
save();
  }
}
  function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function sortEntry(){
    todoList.sort((a,b)=>{
      let aDate=Date.parse(a.date);
      let bDate=Date.parse(b.date);
  return aDate-bDate;
    });

    save();

    let table = document.getElementById("todoTable");
    table.innerHTML=` <tr>
    <td></td>
    <td>Due Date</td>
    <td>Title</td>
    <td>Description</td>
    <td></td>
  </tr>`;
    renderRows();
  }

  function clearTable(){
    let trElems = document.getElementsByTagName("tr");
    for(let i=trElems.length -1;i>0;i--)
    trElems[i].remove();
  }
 
  function onShortListChange(){
    clearTable();

if(shortlistBtn.checked){
  let filteredArray = todoList.filter(obj => obj.done == false);
  filteredArray.forEach(renderRow);
}
  else{
todoList.forEach(renderRow);
  }  
}
  function onTableClicked(event){
if(event.target.matches("td") && event.target.dataset.editable == "true"){
  let tempInputElement;
  switch(event.target.dataset.type){
case "date":
  tempInputElement = document.createElement("input");
  tempInputElement.type="date";
  tempInputElement.value=event.target.dataset.value;
  break;
  case "todo":
    case "description":
      tempInputElement = document.createElement("input");
tempInputElement.value=event.target.innerText;
      break;
      default:
  }
  event.target.innerText="";
  event.target.appendChild(tempInputElement);

  tempInputElement.addEventListener("change",onChange,false);

}
function onChange(event){
 let changeValue=event.target.value;
 let id=event.target.parentNode.dataset.id;
 todoList.forEach(todoObj=>{
if(todoObj.id == id){
  //todoObj.todo = changeValue;
  todoObj[event.target.parentNode.dataset.type]= changeValue;
}
 });
save();

if(event.target.parentNode.dataset.type=="date"){
event.target.parentNode.innerText=formatDate(changeValue);
}
else{
  event.target.parentNode.innerText=changeValue;
}
 }
  }
  function formatDate(date){
    let dateObj = new Date(date);
let formattedDate = dateObj.toLocaleString("en-GB",{
  month: "long",
  day: "numeric",
  year: "numeric",
});
    return formattedDate;
  }
  }

