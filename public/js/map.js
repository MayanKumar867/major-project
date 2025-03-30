
        mapboxgl.accessToken = mapToken;

        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style url
            center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
            zoom: 9 // starting zoom
        });
        const popupOffsets = {
            'top': [0, 10],
            'bottom': [0, -10],
            'left': [10, 0],
            'right': [-10, 0]
        };   
 
        // const marker = new mapboxgl.Marker({color: "red"})
        // .setLngLat(listing.geometry.coordinates)
        // .setPopup(new mapboxgl.Popup({offset: popupOffsets, })
        // .setHTML(`<h3>${listing.location}</h3><p>Exact location provided after booking</p>`))
        // .addTo(map);
    const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: popupOffsets})
    .setHTML(`<h3>${listing.location}</h3><p>Exact location provided after booking</p>`))
    .addTo(map);
     
    //Mouse hover in map marker
    marker.getElement().addEventListener('mouseenter', () => {
        marker.getPopup().addTo(map);
    });
    marker.getElement().addEventListener('mouseleave', () => {
        marker.getPopup().remove();
    });