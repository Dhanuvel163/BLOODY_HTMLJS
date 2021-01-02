function include(file) { 
  
  var script  = document.createElement('script'); 
  script.src  = file; 
  script.type = 'text/javascript'; 
  script.defer = true; 
  
  document.getElementsByTagName('head').item(0).appendChild(script); 
  
} 
  
include('./js/common.js'); 

function navLoad(){
    load()
    samplesload()
}

window.onload=navLoad;

function samplesload(){
    document.getElementById('render').innerHTML=''
    document.getElementsByClassName('alert')[0].style.display='none'
    document.getElementsByClassName('alert')[1].style.display='none'

    if(!isLogin || (isLogin() && !loginType())){
        document.getElementById('alertText').innerText='You Are Not Authenticated !'
        document.getElementsByClassName('alert')[0].style.display='block'
        return
    }
    document.getElementById('loader').style.display='block'
    document.getElementById('unloader').style.display='none'

    const response =fetch('https://internshala-bloddy.herokuapp.com/api/hospitalaccounts/pendingRequest', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization':localStorage.getItem('token')
    },
  }).then((response)=>{
      response.json().then((res)=>{
          if(!res.success){
            document.getElementById('loader').style.display='none'
            document.getElementById('unloader').style.display='block'
            document.getElementById('alertText').innerText=res.message
            document.getElementsByClassName('alert')[0].style.display='block'

          }else{
            document.getElementById('loader').style.display='none'
            document.getElementById('unloader').style.display='block'
            if(res.bloods.length==0){
                document.getElementById('alertTextS').innerText='You have no requests'
                document.getElementsByClassName('alert')[1].style.display='block'
            }
            res.bloods.forEach((element,i) => {
                
            document.getElementById('render').innerHTML+=`
                <div id="${i}">
                    <div style="background-color:blueviolet;  border-style: solid;border-color: white;border-width:1px"
                        class="d-flex justify-content-around align-items-center text-white shadow rounded p-3 mt-5 text-uppercase">
                        <div>
                            <b> Requests For
                                ${element.bloodgroup}
                            </b>
                        </div>

                        <div>
                            <span>
                                <b>
                                    Count :
                                </b>
                            </span>
                            <b>
                                ${element.noofsamples}
                            </b>
                        </div>
                    </div>
                    <div class="row justify-content-around" id="${element._id}">
                        
                    </div>
                </div>
            ` 
            element.Requests.forEach((e)=>{
                document.getElementById(element._id).innerHTML+=`
                        <div class="card mt-3" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${e.name}</h5>
                                <div class="d-flex justify-content-center">
                                    <p>
                                        <span style="color: blueviolet;">
                                            <b>
                                               ${e.email}
                                            </b>
                                        </span>
                                        <b>
                                            ${e.mobile}
                                        </b>
                                    </p>
                                </div>
                                <div class="d-flex justify-content-center">
                                        <button onclick="accept('${e._id}','${element._id}','${i}')" class="btn frameButton shadow">Accept</button>
                                </div>
                            </div>
                        </div>
                `
            })               
            })
          }
      }).catch((err)=>{
            document.getElementById('loader').style.display='none'
            document.getElementById('unloader').style.display='block'
            document.getElementById('alertText').innerText='Server Error ! Please Retry !'
            document.getElementsByClassName('alert')[0].style.display='block'
      })
  })
}

function closeAlert(){
    document.getElementById('alertText').innerText=''
    document.getElementsByClassName('alert')[0].style.display='none'
}

function closeAlertS(){
    document.getElementById('alertTextS').innerText=''
    document.getElementsByClassName('alert')[1].style.display='none'
}

function accept(uid,bid,i){
    document.getElementsByClassName('alert')[0].style.display='none'
    document.getElementsByClassName('alert')[1].style.display='none'

    document.getElementById('loader').style.display='block'
    document.getElementById('unloader').style.display='none'

    const response =fetch(`https://internshala-bloddy.herokuapp.com/api/hospitalaccounts/accept/${bid}/${uid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization':localStorage.getItem('token')
    },
  }).then((response)=>{
      response.json().then((res)=>{
          if(!res.success){
            document.getElementById('loader').style.display='none'
            document.getElementById('unloader').style.display='block'
            document.getElementById('alertText').innerText=res.message
            document.getElementsByClassName('alert')[0].style.display='block'
          }else{

            document.getElementById('loader').style.display='none'
            document.getElementById('unloader').style.display='block'
            document.getElementById(i).style.display='none'
            document.getElementById('alertTextS').innerText=res.message
            document.getElementsByClassName('alert')[1].style.display='block'
          }
      }).catch((err)=>{
          console.log(err)
            document.getElementById('loader').style.display='none'
            document.getElementById('unloader').style.display='block'
            document.getElementById('alertText').innerText='Server Error ! Please Retry !'
            document.getElementsByClassName('alert')[0].style.display='block'
      })
  })
}