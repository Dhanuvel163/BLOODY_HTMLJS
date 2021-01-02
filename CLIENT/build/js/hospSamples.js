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

    if(isLogin() && !loginType()){
        document.getElementById('alertText').innerText='You Are Not Authenticated !'
        document.getElementsByClassName('alert')[0].style.display='block'
        return
    }
    document.getElementById('loader').style.display='block'
    document.getElementById('unloader').style.display='none'

    const response =fetch('https://internshala-bloddy.herokuapp.com/api/hospitalaccounts/bloods', {
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
            // document.getElementById('alertTextS').innerText=res.message
            // document.getElementsByClassName('alert')[1].style.display='block'
            document.getElementById('loader').style.display='none'
            document.getElementById('unloader').style.display='block'
            if(res.blood.length==0){
                document.getElementById('alertTextS').innerText='No data found add samples to find your samples here'
                document.getElementsByClassName('alert')[1].style.display='block'
            }
            res.blood.forEach(element => {
                
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
                                    <b id="${element._id}">
                                        ${element.noofsamples}
                                    </b>
                                </p>
                            </div>
                            <div class="d-flex justify-content-evenly">
                                <button onclick="sub('${element._id}')" class="btn frameButton shadow">➖</button>
                                <button onclick="add('${element._id}')" class="btn frameButton shadow">➕</button>
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




function add(id){
    document.getElementsByClassName('alert')[0].style.display='none'
    document.getElementsByClassName('alert')[1].style.display='none'

    document.getElementById('loader').style.display='block'
    document.getElementById('unloader').style.display='none'

    const response =fetch(`https://internshala-bloddy.herokuapp.com/api/hospitalaccounts/blood/inc/${id}`, {
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
            let data=document.getElementById(id).innerText
            data=parseInt(data)+1
            document.getElementById(id).innerText=data
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


function sub(id){
    document.getElementsByClassName('alert')[0].style.display='none'
    document.getElementsByClassName('alert')[1].style.display='none'

    document.getElementById('loader').style.display='block'
    document.getElementById('unloader').style.display='none'

    const response =fetch(`https://internshala-bloddy.herokuapp.com/api/hospitalaccounts/blood/dec/${id}`, {
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
            let data=document.getElementById(id).innerText
            data=parseInt(data)-1
            document.getElementById(id).innerText=data
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