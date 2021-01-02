function Formsubmit(data){
    var alertElem=document.getElementsByClassName('alert')[0].style.display='none'
    data.preventDefault();
    if(!(document.forms['HREG'].elements['name'].checkValidity() && document.forms['HREG'].elements['mobile'].checkValidity()
    && document.forms['HREG'].elements['password'].checkValidity() && 
    document.forms['HREG'].elements['email'].checkValidity())){
        document.getElementById('alertText').innerText='Please Provide All Required Fields'
        var alertElem=document.getElementsByClassName('alert')[0].style.display='block'
        return
    }
    document.getElementById('loader').style.display='block'
    document.getElementById('unloader').style.display='none'
    var name = document.forms['HREG'].elements['name'].value;
    var mobile = document.forms['HREG'].elements['mobile'].value;
    var password = document.forms['HREG'].elements['password'].value;
    var email = document.forms['HREG'].elements['email'].value;
    let Reqdata={
        name,mobile,password,email
    }
    const response =fetch('https://internshala-bloddy.herokuapp.com/api/hospitalaccounts/signup', {
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