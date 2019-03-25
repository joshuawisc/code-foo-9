$(function() {
    $('#text-intro').show();
    $('#poke-diam').show();
    $('#poke-vol').show();
    let renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize((window.innerWidth - 20) / 2, window.innerHeight - 20);
    renderer.setPixelRatio(window.devicePixelRatio);
    //renderer.shadowMap.enabled = true;
    document.getElementById("container").appendChild(renderer.domElement);

    let scene = new THREE.Scene();



    pokeballSize = 20;

    pokeball = new THREE.Group();
    pokeball.name = 'Pokeball';

    let ballTopGeom = new THREE.SphereGeometry(20, 40, 40, 0, Math.PI*2, 0, Math.PI/2);
    let ballTopMat = new THREE.MeshLambertMaterial({color: "red"});
    let ballTop = new THREE.Mesh(ballTopGeom, ballTopMat);
    ballTop.position.y += 1;

    let ballBotGeom = new THREE.SphereGeometry(20, 40, 40, 0, Math.PI*2, Math.PI/2, Math.PI/2);
    let ballBotMat = new THREE.MeshLambertMaterial({color: "white"});
    let ballBot = new THREE.Mesh(ballBotGeom, ballBotMat);
    ballBot.position.y -= 1;

    let ballMidGeom = new THREE.SphereGeometry(18, 40, 40, 0);
    let ballMidMat = new THREE.MeshLambertMaterial({color: "black"});
    let ballMid = new THREE.Mesh(ballMidGeom, ballMidMat);

    let cylGeom = new THREE.CylinderGeometry(5, 5, 4, 40);
    let cylMat = new THREE.MeshLambertMaterial({color: "black"});
    let cyl = new THREE.Mesh(cylGeom, cylMat);
    cyl.position.z = 18;
    cyl.rotateX(Math.PI/2)

    let cyl2Geom = new THREE.CylinderGeometry(3, 3, 4, 40);
    let cyl2Mat = new THREE.MeshLambertMaterial({color: "white"});
    let cyl2 = new THREE.Mesh(cyl2Geom, cyl2Mat);
    cyl2.position.z = 19;
    cyl2.rotateX(Math.PI/2)

    pokeball.add(cyl2);
    pokeball.add(ballMid);
    pokeball.add(ballBot);
    pokeball.add(ballTop);
    pokeball.add(cyl);
    pokeball.rotateX(Math.PI/8);
    pokeball.rotateY(Math.PI/8);

    //pokeball.rotateX(Math.PI/2);
    //pokeball.rotateY(Math.PI/2);
    //pokeball.rotateZ(Math.PI/2);
    scene.add(pokeball);
    pokeStack = []
    let ballGeom = new THREE.SphereGeometry(20, 40, 40, 0);
    let ballMat = new THREE.MeshLambertMaterial({color: "gray"});
    let ballMat2 = new THREE.MeshLambertMaterial({color: "#4dffa6", transparent: true, opacity: 0.5});
    for (let i = 0 ; i < 7 ; i++) {
        pokeStack[i] = new THREE.Mesh(ballGeom, ballMat);
        pokeStack[i].position.y = -170;
        pokeStack[i].position.z = -40;
        scene.add(pokeStack[i]);
    }
    for (let i = 7 ; i < 10 ; i++) {
        pokeStack[i] = new THREE.Mesh(ballGeom, ballMat2);
        pokeStack[i].position.y = -170;
        pokeStack[i].position.z = -20;
        scene.add(pokeStack[i]);
    }
    pokeStack[0].position.x = 0;
    pokeStack[1].position.x = -40;
    pokeStack[2].position.x = 40;
    pokeStack[3].position.x = -20;
    pokeStack[3].position.y += 35;
    pokeStack[4].position.x = 20;
    pokeStack[4].position.y += 35;
    pokeStack[5].position.x = 20;
    pokeStack[5].position.y -= 35;
    pokeStack[6].position.x = -20;
    pokeStack[6].position.y -= 35;

    pokeStack[7].position.x = 20;
    pokeStack[7].position.y -= 20;
    pokeStack[8].position.x = -20;
    pokeStack[8].position.y -= 20;
    pokeStack[9].position.x = 0;
    pokeStack[9].position.y += 15;


    let towerGeom = new THREE.CylinderGeometry(10, 10, 60, 40);
    let towerMat = new THREE.MeshLambertMaterial({color: "#ffff4d"});
    let tower = new THREE.Mesh(towerGeom, towerMat);
    tower.position.y = -350;
    //.rotateX(Math.PI/2)
    scene.add(tower);

    let ambientLight = new THREE.AmbientLight("white", 0.85);
    scene.add(ambientLight);

    let spot = new THREE.SpotLight("white", 1, 0, Math.PI/2);
    spot.position.set(0, 10, 10);
    scene.add(spot);

    // let spot2 = new THREE.SpotLight("white", 1, 0, Math.PI/4);
    // spot2.position.set(10, 10, -10);
    // scene.add(spot2);

    let camera = new THREE.PerspectiveCamera(50, ((window.innerWidth - 20)/2)/(window.innerHeight - 20), 1, 1000);
    camera.position.z = 250;
    //camera.position.y = 200;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);

    //let controls = new THREE.OrbitControls(camera, renderer.domElement);


    // function render() {
    //     renderer.render(scene, camera);
    //     requestAnimationFrame(render);
    // }

    window.addEventListener('wheel', (event) => {
        //console.log("scrolled");
        event.preventDefault();
        camera.position.y -= event.deltaY * 0.05;
        if (camera.position.y < tower.position.y || camera.position.y > 10) {
            camera.position.y += event.deltaY * 0.05;
        }
        if (camera.position.y > pokeStack[0].position.y)
            pokeball.position.y -= event.deltaY * 0.05;
        else
            pokeball.position.y = pokeStack[0].position.y;

        if (pokeball.position.y > 10)
            pokeball.position.y += event.deltaY * 0.05;
        renderer.render(scene, camera);

        console.log($('#coit-vol').offset().top);
        // If tower's labels are visible, scroll them with the tower
        if ($('#coit-vol').offset().top != 0 && ($('#coit-vol').offset().top < 710 && event.deltaY < 0) || ($('#coit-vol').offset().top > 470  && event.deltaY > 0)) {
            console.log(`${$('#coit-vol').offset().top - (event.deltaY)}px`);
            $('#coit-vol').css('top', `${$('#coit-vol').offset().top - (event.deltaY * 0.16)}px`);
            $('#coit-diam').css('top', `${$('#coit-diam').offset().top - (event.deltaY * 0.16)}px`);
            $('#coit-height').css('top', `${$('#coit-height').offset().top - (event.deltaY * 0.16)}px`);
        }

        $('#text > p').hide();
        $('.label').hide();
        if (Math.abs(camera.position.y - pokeStack[0].position.y) < 100)
            $('#text-lattice').show();
        else if(camera.position.y < pokeStack[0].position.y - 60) {
            $('#coit-vol').show();
            $('#coit-diam').show();
            $('#coit-height').show();
            $('#text-answer').show();
        } else {
            $('#poke-vol').show();
            $('#poke-diam').show();
            $('#text-intro').show();
        }
    });


})
