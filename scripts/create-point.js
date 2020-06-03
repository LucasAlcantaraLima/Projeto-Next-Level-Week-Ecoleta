

function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() ) // function anonima de maineira pequena 'ArrowFunction =>'
    .then( states => {

        for( const state of states ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }

    } )
}

populateUFs()

function getCities(event){
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text


    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/microrregioes`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json() ) 
    .then( cities => {
        

        for( const city of cities ) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    } )
}


document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)



// Itens de Coleta
// pegar todos os li`s
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}


const collectedItems = document.querySelector("input[name=items]")


let selectedItems = []

function handleSelectedItem(event) {

    const itemLi = event.target

    // adicionar ou remover uma classe com javascript
    itemLi.classList.toggle("selected") // adcionando e removendo


    const itemId = itemLi.dataset.id

    
    
    // verificar se existem items selecionados, se sim
    // pegar os items selecionados
    
    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId    // isso sera true ou false
        return itemFound
    } )

    // se ja estiver selecionado,
    if(alreadySelected >= 0 ) {
        // tirar da selecao
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId // false 
            return itemIsDifferent
        })

        selectedItems = filteredItems
    } else {
        // se nao estiver selecionado, adicionar a selacao
        selectedItems.push(itemId)

    }
    
    
    // atualizar o campo escondido com os items selecionados    
    collectedItems.value = selectedItems
}