function Formsubmit(data){
    document.getElementsByClassName('alert')[0].style.display='none'
    document.getElementsByClassName('alert')[1].style.display='none'

    data.preventDefault();
    if(!( document.forms['ASAM'].elements['noofsamples'].checkValidity() && document.forms['ASAM'].elements['bloodgroup'].checkValidity())){
        document.getElementById('alertText').innerText='Please Provide All Required Fields'
        document.getElementsByClassName('alert')[0].style.display='block'
        return
    }
    var noofsamples = document.forms['ASAM'].elements['noofsamples'].value;
    var bloodgroup = document.forms['ASAM'].elements['bloodgroup'].value;
    if(noofsamples<=0){
        document.getElementById('alertText').innerText='Number of samples should not be less than one !'
        document.getElementsByClassName('alert')[0].style.display='block'
        return
    }    
    if(bloodgroup.length>5){
        document.getElementById('alertText').innerText='Provide a valid blood group !'
        document.getElementsByClassName('alert')[0].style.display='block'
        return
    }
    document.getElementById('loader').style.display='block'
    document.getElementById('unloader').style.display='none'
    let Reqdata={
        noofsamples,bloodgroup
    }
    const response =fetch('https://internshala-bloddy.herokuapp.com/api/hospitalaccounts/bloods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization':localStorage.getItem('token')
    },
    body: JSON.stringify(Reqdata)
  }).then((response)=>{
      response.json().then((res)=>{
          if(!res.success){
            document.getElementById('loader').style.display='none'
            document.getElementById('unloader').style.display='block'
            document.getElementById('alertText').innerText=res.message
            document.getElementsByClassName('alert')[0].style.display='block'
          }else{
            document.getElementById('alertTextS').innerText=res.message
            document.getElementsByClassName('alert')[1].style.display='block'
            document.forms['ASAM'].elements['noofsamples'].value='';
            document.forms['ASAM'].elements['bloodgroup'].value='';
            document.getElementById('loader').style.display='none'
            document.getElementById('unloader').style.display='block'
          }
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