//  Search 
var UI = {};
//search using enter press
UI.searchOnEnter = function() {
    document.querySelector('.js-search').addEventListener('keypress', function(e) {
        if(e.key === 'Enter') {
            var userInput = e.target.value;
          //console.log(userInput);
            SoundCloudAPI.getTracks(userInput);
        }
    });
}
//search using mouse click
UI.searchOnClick = function() {
    document.querySelector(".js-submit").addEventListener('click',function() {
        var inputValue = document.querySelector('.js-search').value;
        //console.log(userInput);
        SoundCloudAPI.getTracks(userInput);
    });
}

//calling the search functions
UI.searchOnEnter();
UI.searchOnClick();



//  Query SoundCloud API 

var SoundCloudAPI = {};
SoundCloudAPI.init = function() {

    SC.initialize({
        client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
    });
    
}
SoundCloudAPI.init();
// find all sounds of the query licensed under 'creative commons share alike'
SoundCloudAPI.getTracks = function(inputValue) {
    SC.get('/tracks', {
        q: inputValue
    }).then(function(tracks) {
        console.log(tracks);
        //clear the searchResults after each search
        var searchClear = document.querySelector('.js-search-results');
        searchClear.innerHTML = " ";

        SoundCloudAPI.renderTracks(tracks);
    });
}




//  Display the Cards

SoundCloudAPI.renderTracks = function(tracks) {
    
    tracks.forEach(function(track) {
        //CARD
    
        //create element card as a div
        var card = document.createElement('div');
        card.classList.add('card');
    
        //append the card
        var searchResults = document.querySelector('.js-search-results');
        searchResults.appendChild(card);


        //IMAGE

        //create element image as a div
        var imageDiv = document.createElement('div');
        imageDiv.classList.add('image');
   
        //add image to the element as an image
        var image_img = document.createElement('img');
        image_img.classList.add('image_img');
        image_img.src = track.artwork_url || 'https://i.picsum.photos/id/553/100/100.jpg';
        imageDiv.appendChild(image_img);

        //append the image element to the div
        card.appendChild(imageDiv);
    

        //CONTENT

        //create an element content as a div
        var content = document.createElement('div');
        content.classList.add('content');
    
        //create an element header as a div and add the link
        var header = document.createElement('div');
        header.classList.add('header');
        header.innerHTML= '<a href="' + track.permalink_url +'" target= "_blank">'+track.title+'</a>';
   
        //append the header
        content.appendChild(header);
    
        //append the content
        card.appendChild(content);


        //BUTTON AND ICON

        //create an element button as a div
        var button = document.createElement('div');
        button.classList.add('ui','bottom','attached','button','js-button');
    
        //create an element icon as a an italic
        var icon = document.createElement('i');
        icon.classList.add('add','icon');
   
        //create an element buttonText as a span
        var buttonText = document.createElement('span');
        button.innerHTML = 'Add to Playlist   ';
    
        //append the button
        card.appendChild(button);    
    
        //append the icon
        button.appendChild(icon);  
    
        //append the buttonText
        button.appendChild(buttonText);


        //Add click event to the button
        button.addEventListener('click',function() {
            SoundCloudAPI.playSong(track.permalink_url);
        })
    
    });
};




//  Add to playlist and play
SoundCloudAPI.playSong = function(url) {
    
    SC.oEmbed(url, {auto_play: true}).then(function(oEmbed){
    console.log('oEmbed response: ', oEmbed);

  
    var sideBar = document.querySelector('.col-left');
    var box = document.createElement('div');
    box.innerHTML = oEmbed.html;
    sideBar.insertBefore(box, sideBar.firstChild);

    //Save to localStorage 
    localStorage.setItem("key", sideBar.innerHTML);
});

}
//clear the search bar buffer after each search 
document.querySelector('.js-search').innerHTML = "";

//Finding the sidebar and loading items from the localStorage to the sidebar
var loadSidebar = document.querySelector('.js-playlist');
loadSidebar.innerHTML = localStorage.getItem("key");

//Clear the playlist using the play button
var resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', function() {
    loadSidebar.innerHTML = localStorage.clear();
    loadSidebar.innerHTML = "";
})