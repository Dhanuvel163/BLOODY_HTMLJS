function FormsubmitUser(data){
    var alertElem=document.getElementsByClassName('alert')[0].style.display='none'
    data.preventDefault();
    if(!( document.forms['RLOG'].elements['password'].checkValidity() && document.forms['RLOG'].elements['email'].checkValidity())){
        document.getElementById('alertText').innerText='Please Provide All Required Fields'
        var alertElem=document.getElementsByClassName('alert')[0].style.display='block'
        return
    }
    document.getElementById('loader').style.display='block'
    document.getElementById('unloader').style.display='none'
    var password = document.forms['RLOG'].elements['password'].value;
    var email = document.forms['RLOG'].elements['email'].value;
    let Reqdata={
        password,email
    }
    const response =fetch('https://internshala-bloddy.herokuapp.com/api/useraccounts/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Reqdata)
  }).then((response)=>{
      response.json().then((res)=>{
          if(!res.success){
            document.getElementById('loader').style.display='none'
            document.getElementById('unloader').style.display='block'
              document.getElementById('alertText').innerText=res.message
              var alertElem=document.getElementsByClassName('alert')[0].style.display='block'
          }else{
            document.getElementById('loader').style.display='none'
            document.getElementById('unloader').style.display='block'
              localStorage.setItem('token',res.token)
              localStorage.setItem('hospital',false)
              history.pushState({urlPath:'/index.html'},"",'/index.html')
              window.history.go(0)
          }
      })
  })
}

function closeAlert(){
              document.getElementById('alertText').innerText=''
    var alertElem=document.getElementsByClassName('alert')[0].style.display='none'

}