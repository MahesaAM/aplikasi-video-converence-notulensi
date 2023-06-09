if ("webkitSpeechRecognition" in window) {
  let speechRecognition = new webkitSpeechRecognition();
  let final_transcript = "";
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = document.querySelector("#select_dialect").value;

  speechRecognition.onstart = () => {
    document.querySelector("#status").style.display = "block";
  };
  speechRecognition.onerror = () => {
    document.querySelector("#status").style.display = "none";
    console.log("Speech Recognition Error");
  };
  speechRecognition.onend = () => {
    document.querySelector("#status").style.display = "none";
    console.log("Speech Recognition Ended");
  };
  let jml = 0;
  setInterval(function () {
    $.ajax({ 
   url: '/getNotulen',
   type: 'POST',
   cache: false, 
   data: { 
    kode: urlParams.get('kode'),
    }, 
   success: function(data){
    if(data[1] > jml) {
      data[0].forEach((row) => {
        $('.chat-list').append(`
         <li class="chat-item">
             <div class="chat-content">
                 <h6 class="font-medium">${row.nama}</h6>
                 <div class="box bg-light-success">${row.notulen}</div>
                 <p>${row.jam}</p>
             </div>
         </li>
         `)
    })
    var d = $('.chat-box');
    d.scrollTop(d.prop("scrollHeight"));
    jml = data[1];
    }
    
   }
   , error: function(jqXHR, textStatus, err){
    //    alert('text status '+textStatus+', err '+err)
   }
  })
  }, 5000);
  speechRecognition.onresult = (event) => {
    let interim_transcript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript = event.results[i][0].transcript;
        if (final_transcript != '') {
          let today = new Date();
          let time = today.getHours() + ":" + today.getMinutes();
    //       $('.chat-list').append(`<li class="odd chat-item">
    //     <div class="chat-content">
    //         <div class="box bg-light-inverse">`+final_transcript+`</div>
    //         <br>
    //         <p>`+time+`</p>
    //     </div>
    // </li>`);
    
    $.ajax({
      url: '/insertNotulen',
      type: 'POST',
      dataType: 'JSON',
      data: {
        idRapat:urlParams.get('kode'),
        notulen: {
          nama: 'mahesa',
          notulen: final_transcript,
          jam: time
        }
      }
  })
    }
    scrollNotulen();
    
      } else {
        interim_transcript += event.results[i][0].transcript;
        scrollInput()
        
      }
    }
    document.querySelector("#final").innerHTML = final_transcript;
    document.querySelector("#interim").innerHTML = interim_transcript;
  };
  document.querySelector("#interim").innerHTML = '';
  document.querySelector("#start").onclick = () => {
    speechRecognition.start();
  };
  document.querySelector("#stop").onclick = () => {
    speechRecognition.stop();
  };
} else {
  console.log("Speech Recognition Not Available");
}


const scrollNotulen = () => {
  var d = $('.chat-box');
  d.scrollTop(d.prop("scrollHeight"));
}
