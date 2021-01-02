function FormsubmitHosp(data){
    var alertElem=document.getElementsByClassName('alert')[0].style.display='none'
    data.preventDefault();
    if(!( document.forms['HLOG'].elements['password'].checkValidity() && document.forms['HLOG'].elements['email'].checkValidity())){
        document.getElementById('alertText').innerText='Please Provide All Required Fields'
        var alertElem=document.getElementsByClassName('alert')[0].style.display='block'
        return
    }
    document.getElementById('loader').style.display='block'
    document.getElementById('unloader').style.display='none'
    var password = document.forms['HLOG'].elements['password'].value;
    var email = document.forms['HLOG'].elements['email'].value;
    let Reqdata={
        password,email
    }
    const response =fetch('https://internshala-bloddy.herokuapp.com/api/hospitalaccounts/login', {
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
              localStorage.setItem('hospital',true)
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