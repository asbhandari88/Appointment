/*Created by Amit Bhandari*/

(function(){

    $(document).ready(function(){

    //    Hide form and cancel button on page load
    $("#cancel").hide();
    $(".form-row").hide();

    //    Queries backend to get all appointments when document is ready
    $(function(){
        getAppointment();
    });

    $("#new-add").on("click",function(e){
        e.stopPropagation();
        var element = $(this);
        var value = element.html();
        // Calls function New or Add depending on the html value of new-add button
        if(value == "New"){
            newFn();
        }else{
            addFn();
        }


    });

     //   Calls getAppointment on button click with search string
     $("#search").on("click",function(){
        getAppointment($("#searchtext").val());
     }) ;

    // Hides form and cancel button on click ,also changes html value of new-add button
    $(document).on("click","#cancel",function(e){
        e.stopPropagation();
        $("#cancel,.form-row").hide("slow");
        $("#new-add").html("New");
    });

        //Displays add appointment function
        var newFn = function(){
            $("#cancel,.form-row").show("slow");
            $("#new-add").html("Add");
        }

        //Submits form details to perl cgi
        var addFn = function(){
                $("#new_form").submit();
        }

        //Formats time received from server to be displayed in appointment table
        function formatAMPM(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        //Formats date received from server to be displayed in appointment table
        function formatdate(d){
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            return monthNames[d.getMonth()]+" "+ d.getDate();

        }

        //getAppointment function gets particular appointments with search string or gets all appointments if search string is not provided
        var getAppointment = function(){
            var searchstring = arguments[0];
            var d;
            $.ajax({
                type: 'GET',
                url: 'process.cgi',
                dataType: 'json',
                data: { call :"getAppointment" , search:searchstring},
                success: function(data){
                    console.dir(data);
                    $(".table > tbody > tr").remove();
                    for (var i =0;i<data.length;i++) {
                        console.log(data[i].date);
                        d = new Date(data[i].date);
                        var element = $("<tr></tr>");
                        element.append("<td>"+ formatdate(d)+"</td>");
                        element.append("<td>"+ formatAMPM(d)+"</td>");
                        element.append("<td>"+data[i].description+"</td>");
                        $(".table > tbody").append(element);
                    }
                },
                error: function(){
                    alert("Please configure database credentials in perl cgi");
                },
                complete: function() {
                }
            });



        }
    });

}
)()