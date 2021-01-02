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
    document.getElementsByClassName('alert')[0].style.display='none'
    document.getElementsByClassName('alert')[1].style.display='none'

    if(!isLogin || (isLogin() && loginType())){
        document.getElementById('alertText').innerText='You Are Not Authenticated !'
        document.getElementsByClassName('alert')[0].style.display='block'
        return
    }
    document.getElementById('loader').style.display='block'
    document.getElementById('unloader').style.display='none'

    const response =fetch('https://internshala-bloddy.herokuapp.com/api/useraccounts/acceptedrequests', {
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
                document.getElementById('alertTextS').innerText='You have no accepted requests'
                document.getElementsByClassName('alert')[1].style.display='block'
            }
            res.bloods.forEach(element => {
            document.getElementById('samplesContainer').innerHTML+=`
                    <div class="card mt-3" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${element.bloodgroup}</h5>
                            <div class="d-flex justify-content-center">
                                <p>
                                    <span style="color: blueviolet;">
                                        <b>
                                            Samples count :
                                        </b>
                                    </span>
                                    <b>
                                        ${element.noofsamples}
                                    </b>
                                </p>
                            </div>
                        </div>
                    </div>
            `                
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