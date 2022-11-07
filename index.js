//import data
import { roostData } from '/data.js'

//consts
const roostInput = document.getElementById('roost-input')
const roostBtn = document.getElementById('roost-btn')

//all eventlisteners
roostInput.addEventListener('keypress', enableDisableBtn)
roostInput.addEventListener('blur', enableDisableBtn)
roostInput.addEventListener('keydown', enableDisableBtn)
roostBtn.addEventListener('click', crowFunction)
roostInput.addEventListener('keypress', function(e) {
    // Enter was pressed without shift key
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        crowFunction()
    }
})
document.addEventListener('click', function(e) {
    //like is clicked
    if (e.target.dataset.likes) {
        likeClickHandler(e.target.dataset.likes)
    }
    //retweet is click
    else if (e.target.dataset.reroosts) {
        reRoostClickHandler(e.target.dataset.reroosts)
    }
    //comments are clicked
    else if (e.target.dataset.replies) {
        repliesClickHandler(e.target.dataset.replies)
    }
})

//handle likes
function likeClickHandler(uuid) {
    const targetRoostObj = roostData.filter(function(roost){
        return roost.uuid === uuid
    })[0]
    
    if (!targetRoostObj.isLiked) {
        targetRoostObj.likes++
    }
    else {
        targetRoostObj.likes--
    }
    targetRoostObj.isLiked = !targetRoostObj.isLiked
    renderRoosts()
}

//handle reRoosts
function reRoostClickHandler(uuid) {
    const targetRoostObj = roostData.filter(function(roost){
        return roost.uuid === uuid
    })[0]

    if (!targetRoostObj.isReRoosted) {
        targetRoostObj.reRoosts++
    }
    else {
        targetRoostObj.reRoosts--
    }
    targetRoostObj.isReRoosted = !targetRoostObj.isReRoosted
    renderRoosts()
}

//handle replies clicked
function repliesClickHandler(uuid) {
    console.log(uuid)
}

function enableDisableBtn() {
    if(roostInput.value && roostBtn.disabled){
        roostBtn.disabled = false
    }
    else if (roostInput.value === "" && roostBtn.disabled === false) {
        roostBtn.disabled = true
    }
}

//get feed from data
function getFeedHtml() {
    let htmlData = ''
    roostData.forEach(roost => {
        //check if user of roost is verified
        let userName = ''
        if (roost.isVerified){
            userName = `<p class="handle">${roost.handle}<i class="fa-solid fa-circle-check verified"></i></p>`
        }
        else {
            userName = `<p class="handle">${roost.handle}`
        }
        //write tweets
        htmlData += `
            <div class="roost">
            <div class="roost-inner">
                <img src="${roost.profilePic}" class="profile-pic">
                <div>
                    ${userName}
                    <p class="roost-text">${roost.roostText}</p>
                    <div class="roost-details">
                        <span class="roost-detail">
                            <i class="fa-solid fa-comment-dots" data-replies="${roost.uuid}"></i>
                            ${roost.replies.length}
                        </span>
                        <span class="roost-detail">
                            <i class="fa-solid fa-heart" data-likes="${roost.uuid}"></i>
                            ${roost.likes}
                        </span>
                        <span class="roost-detail">
                            <i class="fa-solid fa-retweet" data-reroosts="${roost.uuid}"></i>
                            ${roost.reRoosts}
                        </span>
                    </div>   
                </div>            
            </div>
        </div>
        `
    })
    return htmlData
}

function renderRoosts() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

function crowFunction() {
    console.log(roostInput.value)
}

renderRoosts()