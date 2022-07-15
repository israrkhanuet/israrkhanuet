chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    let userSignedIn = false;
    let returnSession = false;
    let userPackage = null;
    async function flip_user_status(signIn,userInfo){
        if(signIn){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(userInfo)
            };
            return fetch('https://booksbytitans-server-vwy33.ondigitalocean.app/api/account/login',requestOptions)
                .then(response => response.json()).then(user =>{
                return new Promise((resolve)=>{
                    console.log()
                if(!user.token) resolve('fail');
                
                
                userPackage = user?.userPackage;
                chrome.storage.local.set({'userStatus': signIn, 'userInfo' : user, 'token': user.token},function(){
                    if(chrome.runtime.lastError) resolve('fail');
                   
                    userSignedIn = true;
                    resolve('success');
                })
            })
            })
            .catch(err =>{ console.log(err) });
        }else if(!signIn){
            
            return new Promise((resolve)=>{
            chrome.storage.local.get(['userStatus', 'userInfo', 'token'],function(response){
                if(chrome.runtime.lastError) resolve('fail');
                
                if(response.userStatus == undefined && response.token == null)  resolve('fail'); 

                    chrome.storage.local.set({userStatus:signIn, userInfo:{},token:null},function(){
                        if(chrome.runtime.lastError) resolve('fail');

                        userSignedIn = signIn;
                        resolve('success');
                      })
            })
        })

        }
    }

    if(request.message == "login"){
        flip_user_status(true,request.payload)
        .then((res)=> sendResponse(res))
        .catch((err)=> console.log(err));
        return true;
    }else if(request.message == "logout"){
        flip_user_status(false,null)
        .then((res)=> sendResponse(res))
        .catch((err)=> console.log(err));
        return true;
    }
    else if(request.message == 'userStatus'){
        console.log(userPackage);
        is_user_signed_in()
        .then(res => sendResponse(res))
        .catch(err => console.log(err));
        return true;
    }
    else if(request.message == 'packageInfo'){
        getPackageInfo()
        .then(res => { 
            if(Date.parse(res.subscription_due) > Date.now()){ 
                sendResponse(true);
                return true;
            }})
        .catch(err => { sendResponse(err); return true;});
    }


    function is_user_signed_in(){
        return new Promise(resolve=>{
            chrome.storage.local.get(['userStatus','userInfo'],function(response){
                if(chrome.runtime.lastError) resolve({userStatus:false, userInfo:{}});

                resolve(
                    response.userStatus == undefined ?
                    {userStatus:false, userInfo:{}}:
                    {userStatus:response.userStatus,userInfo:response.userInfo}
                )
            })
        })
    }

    async function getPackageInfo(){
        chrome.storage.local.get(['token'],async function(response){
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}`},
            };
                   let res =  await fetch(`https://booksbytitans-server-vwy33.ondigitalocean.app/api/exosub`,requestOptions);
                    if(res.status != 200) return 'fail';


                    return res;
                });
    }


    
 

     

    is_user_signed_in().then(res => {
        if(res.userStatus) return returnSession = true;

        userSignedIn = res.userSignedIn;
    }).catch((err)=> console.log(err));

    chrome.browser.onClicked.addListener(function(){
        is_user_signed_in().then(res => {
            if(res.userStatus) {
                    chrome.windows.create({
                        url:'./popup.html',
                        width:300,
                        height:600,
                        focused: true
                    })
            }else{
                    chrome.windows.create({
                        url:'./pop-up-sign-in.html',
                        width:300,
                        height:600,
                        focused: true
                    })
            }
    });
    });


});

// function messageListenerFunc(request, sender, sendResponse) {
//   console.log("request", request);
//   if (request.message === "postToGoogle") {
//     chrome.tabs.create({ url: "https://www.google.com/" }, function (tab) {
//       console.log(tab.id);
//       sendResponse(tab.id);
//       // chrome.tabs.executeScript(tab.id, {
//       //   code:
//       //     "var myScript = document.createElement('script');" +
//       //     "myScript.textContent = 'messageOpen(15, false);';" +
//       //     "document.head.appendChild(myScript);",
//       // });
//     });
//   }
//   return true;
// }
