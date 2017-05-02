function myMap() {
    var mapProp= {
        center:new google.maps.LatLng(41.9282136,2.2548966),
        zoom:12,
    };
    var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    var terminal = document.getElementById("terminal").value
    var date = document.getElementById("date").value

    var urlString = "http://10.4.47.125:8080/route"
    if (terminal === "" && date === "") {
        document.getElementById("acceptbtn").className = "btn btn-danger"
    } else {
        urlString = urlString+"?terminal="+terminal+"&date="+date
        document.getElementById("acceptbtn").className = "btn btn-success"
    }

    $.getJSON(urlString, function(data) {
        var positions = displayMarkers(map, data)
        displayPolyline(map, positions)
    });
}

function displayMarkers(map, data) {
    var positions = []
    data.forEach(function(item, index, array) {
        dict = {lat:item.lat, lng:item.lng}
        positions.push(dict)
        var marker=new google.maps.Marker({
        position:dict,
        label:''+index+'',
        map:map
        })
     })
    var lastMark=new google.maps.Marker({
    position:positions[positions.length-1],
    label:'F',
    map:map
    })

    if (positions.length > 0) {
        map.setCenter(positions[positions.length-1])
    } else {
        document.getElementById("acceptbtn").className = "btn btn-danger"
        map.setCenter({lat:41.9282136,lng:2.2548966})
    }
    return positions
}

function displayPolyline(map, positions) {
    var routeLine = new google.maps.Polyline({
        path:positions,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 2
    })
    routeLine.setMap(map)
}
