//import data
import { roostData } from '/data.js'

//consts & lets
const roostInput = document.getElementById('roost-input')

//All clickhandlers
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
        repliesClickHandler(e.target.dataset.replies, e.target)
    }
    else if (e.target.id === 'roost-btn') {
        handleCrowBtn()
    }
})
//all handlers for the inputfield (keypresses, buttons, etc)
roostInput.addEventListener('keypress', function(e){
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleCrowBtn()
    }
    else {
        enableDisableBtn
    }
})
roostInput.addEventListener('blur', enableDisableBtn)
roostInput.addEventListener('keydown', enableDisableBtn)

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
function repliesClickHandler(uuid, targetBtn) {
    if (document.getElementById("replies-"+uuid).innerHTML != "") {
        document.getElementById("replies-"+uuid).classList.toggle("hidden")
        targetBtn.classList.toggle('active')
    }
}

function enableDisableBtn() {
    const roostBtn = document.getElementById('roost-btn')
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
        let likeIconClass = ''
        let reRoostClass = ''

        //check verification
        let isVerified = ''
        if (roost.isVerified) {
            isVerified = `<i class="fa-solid fa-circle-check verified"></i>`
        }

        //check if liked
        if (roost.isLiked) {
            likeIconClass = "liked"
        }

        //check if reroosted
        if (roost.isReRoosted) {
            reRoostClass = "reroosted"
        }

        //check if roost has replies
        let replies = ''
        let verifiedReply = ''
        if (roost.replies.length > 0){
            roost.replies.forEach(function(reply){
                if (reply.isVerified) {
                    verifiedReply = `<i class="fa-solid fa-circle-check verified"></i>`
                }
                replies += `
                    <div class="roost-reply">
                        <div class="roost-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}${verifiedReply}</p>
                                <p class="roost-text">${reply.roostText}</p>
                            </div>
                        </div>
                    </div>
                `
            })
        }

        //write tweets
        htmlData += `
            <div class="roost">
            <div class="roost-inner">
                <img src="${roost.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${roost.handle}${isVerified}</p>
                    <p class="roost-text">${roost.roostText}</p>
                    <div class="roost-details">
                        <span class="roost-detail">
                            <i class="fa-solid fa-comment-dots" data-replies="${roost.uuid}"></i>
                            ${roost.replies.length}
                        </span>
                        <span class="roost-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}" data-likes="${roost.uuid}"></i>
                            ${roost.likes}
                        </span>
                        <span class="roost-detail">
                            <i class="fa-solid fa-retweet ${reRoostClass}" data-reroosts="${roost.uuid}"></i>
                            ${roost.reRoosts}
                        </span>
                    </div>   
                </div>            
            </div>
        </div>
        <div class="hidden" id="replies-${roost.uuid}">${replies}</div>  
        `
    })
    return htmlData
}

function renderRoosts() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

function handleCrowBtn() {
    console.log(roostInput.value)
}

renderRoosts()