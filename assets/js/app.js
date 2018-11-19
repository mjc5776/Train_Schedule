 // Initialize Firebase
 
 var config = {
    apiKey: "AIzaSyACe_pT6xHqbE8WBxXdrtuJ95rXra82PUw",
    authDomain: "traintime-f519a.firebaseapp.com",
    databaseURL: "https://traintime-f519a.firebaseio.com",
    projectId: "traintime-f519a",
    storageBucket: "",
    messagingSenderId: "315605578167"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  
    var trainTime = "";
    var trainFrequency = "";
    


    $("#submit-btn").on("click", function(event) {
        event.preventDefault();

        // Get the input values
        var trainName = $("#trainName").val().trim();
        var trainDest = $("#trainDestination").val().trim();
        var firstTime = $("#trainTime").val().trim();
        var trainFrequency = $("#trainFrequency").val().trim();

        if(trainName ==''){
          swal({
            text: "Please enter the name of a train.",
            icon: "warning"
          });
         
        }else if(trainDest ==''){
          swal({
            text: "Please enter a train destination",
            icon: "warning"
          });
        }else if(firstTime ==''){
          swal({
            text: "Please enter the First Train Time",
            icon: "warning"
          });
        }else if(trainFrequency ==''){
          swal({
            text: "Please enter the Train Frequency",
            icon: "warning"
          });

        }else{
        
        var newTrain = {
          TrainName: trainName,
          TrainDestination: trainDest,
          FirstTime: firstTime,
          TrainFrequency: trainFrequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
        };
        
        database.ref().push(newTrain);
         
          //Clear input boxes
          $("#trainName").val("");
          $("#trainDestination").val("");
          $("#trainTime").val("");
          $("#trainFrequency").val("");

         
        };  
    });

     // Firebase watcher + initial loader HINT: .on("value" 

    database.ref().on("child_added", function(childSnapshot) {

      var trName = childSnapshot.val().TrainName;
      var trDest = childSnapshot.val().TrainDestination;
      var trFreq = childSnapshot.val().TrainFrequency;
      var trFirstTime = childSnapshot.val().FirstTime;
      console.log(trFirstTime + "FirstTime") ;
        
        var firstTimeConverted = moment(trFirstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted + " Time Converted") ;
        
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % trFreq;
        console.log(tRemainder +' '+"Remainder");

        // Minute Until Train
        tMinTillTrain = trFreq - tRemainder;
        console.log(tMinTillTrain +' '+"Min Until Train");

        // Next Train
        nextTrain = moment().add(tMinTillTrain, "minutes")
        var nextTrainConvert = moment(nextTrain).format("hh:mm A")
        console.log(nextTrainConvert +' '+"Next Train");
      
      
      var newRow = $("<tr>").append(
          $("<td>").text(trName),
          $("<td>").text(trDest),
          $("<td>").text(trFreq),
          $("<td>").text(nextTrainConvert),
          $("<td>").text(tMinTillTrain)
      );
      
     $("#trainTable >tbody").append(newRow);
    
      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

   