// axios allows you to make HTTP requests, its promise-based, use response.data
const ul = document.querySelector('ul')

ul.addEventListener('click', async(e) => {
    if (e.target.tagName === 'LI') {
        const id = e.target.getAttribute('data-id') 
        await axios.delete(`api/things/${id}`)
        render()
    }
})
const render = async() => {
    const response = await axios.get('api/things')
    const things = response.data
    const html = things.map(thing => {
        return `
            <li data-id='${thing.id}'>${thing.name}</li>
        `
    }).join('')
    ul.innerHTML = html
}
render()

