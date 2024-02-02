const name = document.getElementById("bookName").innerHTML;
const title = name.trim("").replaceAll(' ', '-');
const url = `https://openlibrary.org/search.json?q=${title}&limit=1`

fetch(url).then(response => response.json()).then(data => {
    document.getElementById('publisher').innerHTML = data.docs[0].publisher[0];
    document.getElementById('pages').innerHTML = data.docs[0].number_of_pages_median;
});