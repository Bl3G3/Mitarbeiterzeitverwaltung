/**
 * Created by Basti on 04.05.2017.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/swp-db');



function selectEmployee(id, forname, surname){
    //alert("test")
    document.getElementById("manrfield").value = id;
    document.getElementById("fornamefield").value = forname;
    document.getElementById("surnamefield").value = surname;

}


module.exports.getUserData = getUserData;





//
// function search() {
//
//     var result = new Array();
//
//     if(document.getElementById("manrfield").value){
//         var id = document.getElementById("manrfield").value;
//         Mitarbeiter.find({id: id},
//             function(err, response){
//                 console.log(response);
//                 result = JSON.stringify(response);
//             });
//     } else
//     if(document.getElementById("fornamefield").value && document.getElementById("surnamefield").value){
//         var vorname = document.getElementById("fornamefield").value;
//         var nachname = document.getElementById("surnamefield").value;
//         Mitarbeiter.find({vorname: vorname, nachname: nachname},
//             function(err, response){
//                 console.log(response);
//                 result = JSON.stringify(response);
//             });
//     } else
//     if(document.getElementById("fornamefield").value){
//         var vorname = document.getElementById("fornamefield").value;
//         Mitarbeiter.find({vorname: vorname},
//             function(err, response){
//                 console.log(response);
//                 result = JSON.stringify(response);
//             });
//     } else
//     if(document.getElementById("surnamefield").value){
//         var nachname = document.getElementById("surnamefield").value;
//         Mitarbeiter.find({nachname: nachname},
//             function(err, response){
//                 console.log(response);
//                 result = JSON.stringify(response);
//             });
//     }
//
//     var tableContent = new Array(mitarbeiter);
//

    // for (var i = 0; i< result.length; i++){
    //
    //
    //     content += '<tr id="' + json[i].ID + '">';
    //     content += '<td><input id="check_' + json[i].ID + '" name="check_' + json[i].ID + '" type="checkbox" value="' + json[i].ID + '" autocomplete=OFF /></td>';
    //     content += '<td>' + json[i].ID + '</td>';
    //     content += '<td>' + json[i].Name + '</td>';
    //     content += '<td>' + json[i].CountryCode + '</td>';
    //     content += '<td>' + json[i].District + '</td>';
    //     content += '<td>' + json[i].Population + '</td>';
    //     content += '<td><a href="#" class="edit">Edit</a> <a href="#" class="delete">Delete</a></td>';
    //     content += '</tr>';


        //each mitarbeiter in maArray
        //    tr(onclick="selectEmployee('" + mitarbeiter.id + "', '" + mitarbeiter.vorname + "', '" + mitarbeiter.nachname + "')")
        //      td #{mitarbeiter.id}
        //      td #{mitarbeiter.vorname}
        //      td #{mitarbeiter.nachname}
        //      td #{mitarbeiter.telefon}
        //      td #{mitarbeiter.email}
        //      td #{mitarbeiter.abteilung}
    // }

// }

//
// function toggleTable() {
//     var table = document.getElementById("slide");
// //    table.style.height == '50px' || table.style.height == ''
//   //      ? table.style.height = '150px'
//     //    : table.style.height = '20px';
//
//     //table.style.display = 'none';
//     (table.style.display=='block') ? table.style.display='none' : table.style.display='block' ;
// }
//
