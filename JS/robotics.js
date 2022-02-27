//יצירת המפה והגדרות

$(document).ready(function () {
    govmap.createMap('map',
        {
            token: '5a4b8472-b95b-4687-8179-0ccb621c7990',
            visibleLayers: ["TEMP_BRIDGE"],
            layers: ["TEMP_BRIDGE"],
            showXY: true,
            identifyOnClick: true,
            level: 6,
            layersMode: 2,
            zoomButtons: true
        });
       focus_on_center();
});
let notify
let tolerance
function paintline(){
    govmap.draw(govmap.drawType.Polyline).progress(function (response)  
    {  
        wkts: ['LINESTRING(170704.30 579380.05, 232881.51 556890.42, 232881.51 556890.42)'],    
       notify;false,
        tolerance; 11906.273812547624
    });  
}

//מיקוד על אמצע הארץ בפתיחת המפה

function focus_on_center() {
    let params = {
        keyword: "ארלוזורוב 1 תל אביב",
        type: govmap.geocodeType.AccuracyOnly
    };
    govmap.geocode(params).then(function (response) {
        console.log("focus_on_center",response.data[0]);
        govmap.zoomToXY({x: response.data[0].X,y: response.data[0].Y, level: 4, marker: false });
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
            keyword: document.getElementById('destination').value,
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



document.onkeydown = function(ev) {
    if (ev.code == 'Enter') { 
        filter_bridges(); mark_way_points() 
    }
}
function clear(){
    var data = {  
        wkts: ['LINESTRING(170704.30 579380.05, 232881.51 556890.42, 232881.51 556890.42)'],    
        geometryType: govmap.geometryType.Polyline,  
        defaultSymbol:  
            {  
            color: [255, 0, 80, 1],  
            width: 1,  
            },  
        symbols: [],  
        clearExisting: true,  
        };  
};
function showExample(){
    var data = {  
        wkts: ['LINESTRING(181638.5702018566 691584.9075372377, 230586.58476455236 683382.807799705)'],  
        names: ['p1'],  
        geometryType: govmap.geometryType.POLYLINE,  
        defaultSymbol:  
            {  
            color: [255, 0, 80, 1],  
            width: 1,  
            },  
        symbols: [],  
        clearExisting: true,  
        data: {  
            tooltips: ['חדשות ynet'],  
            headers: ['חדשות'],
            bubbles: ['L-2,00.html'],  
            bubbleUrl: 'https://www.ynet.co.il/home/0,7340,' 
        }  
        };  
    govmap.displayGeometries(data).then(function (response)  
    {  
      console.log(response.data);
    });  
}