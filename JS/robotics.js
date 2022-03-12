
//יצירת המפה והגדרות

$(document).ready(function () {
    govmap.createMap('map',
        {
            token: location.hostname === 'localhost' ? '5a4b8472-b95b-4687-8179-0ccb621c7990' : '23233477-3185-4bc4-9200-71cbb1b2b5b5',
            visibleLayers: ["TEMP_BRIDGE"],
            layers: ["TEMP_BRIDGE"],
            showXY: true,
            identifyOnClick: true,
            level: 4,
            center:{x:178586.579,y:666130.0514},
            layersMode: 2,
            zoomButtons: true
        });
        
        // השלמה אוטומטית של תיבות הטקסט

        var options = {
            url: 'https://es.govmap.gov.il/TldSearch',
            subjectId: 16399,
            placeholder: "",
            onInput: function onInput(res) {},
            onSelect: function onSelect(res) {}
        };
        autocomplete(document.getElementById("starting_point"), options)
autocomplete(document.getElementById("destination_point"), options)
});
    
//סרטוט מסלול

let notify
let tolerance
function paintline(){
    govmap.draw(govmap.geometryType.POLYLINE).progress(function (response)  
    {  
        wkts: ['LINESTRING(170704.30 579380.05, 232881.51 556890.42, 232881.51 556890.42)'],    
       notify;false,
        tolerance; 11906.273812547624
    });  
}

//יצירת סימונים על המפה

function mark_way_points() {
    var from, to;
    let params = {
        keyword: document.getElementById('starting_point').value,
        type: govmap.geocodeType.AccuracyOnly
    };
    govmap.geocode(params).then(function (response) {
        console.log(response);
        let from = response.data[0]
        params = {
            keyword: document.getElementById('destination_point').value,
            type: govmap.geocodeType.AccuracyOnly
        };
        govmap.geocode(params).then(function (response) {
              govmap.zoomToXY({x:from.X,y:from.Y,level:6 ,marker: false})

            console.log(response);
            let to = response.data[0]
            //Create data object
            var data = {
                wkts: ['POINT(' + from.X + ' ' + from.Y + ')', 'POINT(' + to.X + ' ' + to.Y + ')'],
                names: ['p1', 'p2'],
                geometryType: govmap.drawType.Point,
                defaultSymbol:
                {
                    url: 'https://www.waze.com/livemap/assets/pin-9ad4ceb21a2449b4d0bcacdcf464f015.png',
                    width: 45,
                    height: 45
                },

                clearExisting: true,
                data: {
                    tooltips: ['מוצא', 'יעד'],
                }
            };
            govmap.displayGeometries(data).then(function (response) {
                console.log("marker", response.data);
            });
        });
    });
}

//סינון הגשרים הנמוכים מגובה המשאית והצגתם על המפה

function filter_bridges() {
    let TH = document.getElementById("TRACK_H").value

    var params = {
        layerName: 'TEMP_BRIDGE',
        whereClause: ("VERT_GAP < " + TH),
        zoomToExtent: false
    }

    govmap.filterLayers(params);

}
// יצירת האופציה של לחיצת מקש אנטר כדי לסנן במקום ללחוץ על כפתור החיפוש

document.onkeydown = function(ev) {
    if (ev.code == 'Enter') { 
        filter_bridges(); mark_way_points() 
    }
}

// ניקוי הסרטוטים מהמפה

    function clearMap(){
        govmap.clearDrawings();   
    let params = {
        keyword: "ארלוזורוב 1 תל אביב",
        type: govmap.geocodeType.AccuracyOnly
    };
    govmap.geocode(params).then(function (response) {
        console.log("focus_on_center",response.data[0]);
        govmap.zoomToXY({x: response.data[0].X,y: response.data[0].Y, level: 4, marker: false });
        document.getElementById('starting_point').value = ''
        document.getElementById('destination_point').value = ''
        document.getElementById('TRACK_H').value = ''
        govmap.clearGeometriesByName(['p1', 'p2']);
    });
}
