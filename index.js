//import data
import { roostData } from '/data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'
let roostDataFromLS = []

//consts & lets
const roostInput = document.getElementById('roost-input')
let currentUser = {
    handle: ``,
    profilePic: ``,
    isVerified: false,
}
const loginForm = document.getElementById('login-form')
const avatarPic = document.getElementById('avatar')
let fileURL = ''

//disable onload
document.querySelector('main').style.cssText = `
    filter: blur(5px);
    pointer-events: none;
    user-select: none;
`
document.querySelector('header').style.cssText = `
    filter: blur(5px);
    pointer-events: none;
    user-select: none;
`
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    else if (e.target.dataset.delete) {
        deleteClickHandler(e.target.dataset.delete)
    }
    else if (e.target.id === 'roost-btn') {
        handleCrowBtn()
    }
})
roostInput.addEventListener('keypress', function(e){
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleCrowBtn()
        roostInput.blur()
    }
    else {
        enableDisableBtn
    }
})
roostInput.addEventListener('blur', enableDisableBtn)
roostInput.addEventListener('keydown', enableDisableBtn)

loginForm.addEventListener('submit', logUser)

avatarPic.addEventListener('change', () => {
    if(avatarPic.files[0].size > 2500000)
    {
       alert("File too big! Max file size = 2.5MB");
       avatarPic.value = "";
    }
    else {
        const fr = new FileReader()
        //start reading of file
        fr.readAsDataURL(avatarPic.files[0]);
        //listen for read completion
        fr.addEventListener('load', () => {
            //when reading is complete
            fileURL = fr.result
        })
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//handle upload of avatar
function upload_check()
{
    
};


//handle login and hide modal
function logUser(event) {
    event.preventDefault()
    const userName = document.getElementById('username')
    currentUser = {
        handle: `@${userName.value}`,
        profilePic: `${fileURL}`,
        isVerified: false,
    }
    hideModal()
    if (fileURL) {
        document.getElementById("user-profile-pic").src = fileURL
        currentUser.profilePic = fileURL
    }
    else {
        document.getElementById("user-profile-pic").src = "images/eitje.png"
        currentUser.profilePic = "images/eitje.png"
    }
    //store stuff in the LocalStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    renderRoosts()
}

function hideModal() {
    document.querySelector('main').style.cssText = `
    filter: null;
    pointer-events: null;
    user-select: null;
    `
    document.querySelector('header').style.cssText = `
        filter: null;
        pointer-events: null;
        user-select: null;
    `
    document.getElementById('intro-modal').style.display = 'none'
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//handle likes
function likeClickHandler(uuid) {
    const targetRoostObj = roostDataFromLS.filter(function(roost){
        return roost.uuid === uuid
    })[0]
    
    if (!targetRoostObj.isLiked) {
        targetRoostObj.likes++
    }
    else {
        targetRoostObj.likes--
    }
    targetRoostObj.isLiked = !targetRoostObj.isLiked
    JSON.stringify(localStorage.setItem('roostData', JSON.stringify(roostDataFromLS)))
    renderRoosts()
}

//handle reRoosts
function reRoostClickHandler(uuid) {
    const targetRoostObj = roostDataFromLS.filter(function(roost){
        return roost.uuid === uuid
    })[0]

    if (!targetRoostObj.isReRoosted) {
        targetRoostObj.reRoosts++
    }
    else {
        targetRoostObj.reRoosts--
    }
    targetRoostObj.isReRoosted = !targetRoostObj.isReRoosted
    JSON.stringify(localStorage.setItem('roostData', JSON.stringify(roostDataFromLS)))
    renderRoosts()
}

//handle replies clicked
function repliesClickHandler(uuid, targetBtn) {
    if (document.getElementById("replies-"+uuid).innerHTML != "") {
        document.getElementById("replies-"+uuid).classList.toggle("hidden")
        targetBtn.classList.toggle('active')
    }
}

//handle delete button clicked
function deleteClickHandler(uuid) {
    roostDataFromLS.splice(roostDataFromLS.findIndex(roost => roost.uuid === uuid), 1)
    JSON.stringify(localStorage.setItem('roostData', JSON.stringify(roostDataFromLS)))
    renderRoosts()
}

//handle the fact that the text-box has content, allowing to roost or not
function enableDisableBtn() {
    const roostBtn = document.getElementById('roost-btn')
    if(roostInput.value && roostBtn.disabled){
        roostBtn.disabled = false
    }
    else if (roostInput.value === "" && roostBtn.disabled === false) {
        roostBtn.disabled = true
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//get feed from data
function getFeedHtml() {
    let htmlData = ''
    roostDataFromLS.forEach(roost => {
        let likeIconClass = ''
        let reRoostClass = ''

        //check verification
        let isVerified = ''
        if (roost.isVerified || roost.handle==="@MrFranks" || roost.handle==="@Neffur") {
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

        //check if tweet is owned by user - allow delete
        let deleteOption = ''
        if (roost.handle === currentUser.handle) {
            deleteOption = `<i class="fa-solid fa-trash" data-delete="${roost.uuid}"></i>`
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
                        <span class="roost-detail">
                            ${deleteOption}
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
    //existing user
    if (localStorage.getItem('currentUser')){
        hideModal()
        currentUser = {
            handle: JSON.parse(localStorage.getItem("currentUser")).handle,
            profilePic: JSON.parse(localStorage.getItem("currentUser")).profilePic,
            isVerified: false,
        }
        document.getElementById("user-profile-pic").src = JSON.parse(localStorage.getItem("currentUser")).profilePic
        roostDataFromLS = JSON.parse(localStorage.getItem('roostData'))
        document.getElementById('feed').innerHTML = getFeedHtml()
    }
    //new user
    else {
        //transfer roostData to LS
        JSON.stringify(localStorage.setItem('roostData', JSON.stringify(roostData)))
        //transfer from LS to let
        roostDataFromLS = JSON.parse(localStorage.getItem('roostData'))
        document.getElementById('feed').innerHTML = getFeedHtml()
    }
}

function handleCrowBtn() {
    let isProfilePic = ''
    if (currentUser.profilePic) {
        isProfilePic = currentUser.profilePic
    }
    else {
        isProfilePic = "images/eitje.png"
    }
    if (roostInput.value) {
        const roost = 
        {
            handle: `${currentUser.handle}`,
            profilePic: isProfilePic,
            likes: 0,
            reRoosts: 0,
            roostText: roostInput.value ,
            replies: [],
            isLiked: false,
            isReRoosted: false,
            isVerified: currentUser.isVerified,
            uuid: uuidv4()
        }
        roostInput.value = ''
        roostDataFromLS.unshift(roost)
        JSON.stringify(localStorage.setItem('roostData', JSON.stringify(roostDataFromLS)))
        renderRoosts()
    }
}

renderRoosts()