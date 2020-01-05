const stlReader = vtk.IO.Geometry.vtkSTLReader.newInstance();
const mapper = vtk.Rendering.Core.vtkMapper.newInstance();
const actor = vtk.Rendering.Core.vtkActor.newInstance();

actor.getProperty().setColor(1.0000, 0.3882, 0.2784)
actor.setMapper(mapper)
mapper.setInputConnection(stlReader.getOutputPort())


var stlButtonWrapper = document.querySelector(".stlButtonWrapper");
var stlFileInput = stlButtonWrapper.querySelector('input')

var pointDatas = [];

function updateMulti(files) {
    const vtkRenderWindow = vtk.Rendering.Core.vtkRenderWindow.newInstance();
    const vtkRenderer = vtk.Rendering.Core.vtkRenderer.newInstance();
    const openGLRenderWindow = vtk.Rendering.OpenGL.vtkRenderWindow.newInstance();

    vtkRenderWindow.addRenderer(vtkRenderer)

    for (let i=0; i < files.length; i+=1) {
        const stlReader = vtk.IO.Geometry.vtkSTLReader.newInstance();
        const mapper = vtk.Rendering.Core.vtkMapper.newInstance();
        const actor = vtk.Rendering.Core.vtkActor.newInstance();
        if (i===0) {
            actor.getProperty().setOpacity( 0.5);
        }
        actor.setMapper(mapper)
        mapper.setInputConnection(stlReader.getOutputPort())

        const fileReader = new FileReader();
        fileReader.onload = function onLoad() {
            stlReader.parseAsArrayBuffer(fileReader.result);
            vtkRenderer.addActor(actor)
            vtkRenderer.resetCamera();
            //console.log(stlReader.getOutputData().getNumberOfPolys());
            var mesh = stlReader.getOutputData();
            var points = mesh.getPoints()
            var pointData = []
            // console.log(JSON.stringify(points))
            var numPts = points.getNumberOfPoints()
            for (var i = 0; i < numPts; i++) {
                let point = points.getPoint(i);
                pointData.push({
                    x: point[0],
                    y: point[1],
                    z: point[2],
                    node_id: i
                });
            }
            pointDatas.push(pointData);
            console.log('Point data created. ' + pointData.length)
            //console.log("Done")
            //console.log(JSON.stringify(pointData))
        };


        fileReader.readAsArrayBuffer(files[i]);
    }



    vtkRenderWindow.addView(openGLRenderWindow);
    var stlViewElement = document.querySelector(".stlView");
    openGLRenderWindow.setContainer(stlViewElement);

    const { width, height } = stlViewElement.getBoundingClientRect();
    openGLRenderWindow.setSize(width, height);

    const  vtkRenderWindowInteractor = vtk.Rendering.Core.vtkRenderWindowInteractor.newInstance();
    vtkRenderWindowInteractor.setView(openGLRenderWindow);
    vtkRenderWindowInteractor.initialize();
    vtkRenderWindowInteractor.bindEvents(stlViewElement);

    const vtkInteractorStyleTrackballCamera = vtk.Interaction.Style.vtkInteractorStyleTrackballCamera.newInstance()
    vtkRenderWindowInteractor.setInteractorStyle(vtkInteractorStyleTrackballCamera);
}

function update() {
    const vtkRenderWindow = vtk.Rendering.Core.vtkRenderWindow.newInstance();
    const vtkRenderer = vtk.Rendering.Core.vtkRenderer.newInstance();
    const openGLRenderWindow = vtk.Rendering.OpenGL.vtkRenderWindow.newInstance();

    vtkRenderWindow.addRenderer(vtkRenderer);

    vtkRenderer.addActor(actor);
    vtkRenderer.resetCamera();

    vtkRenderWindow.addView(openGLRenderWindow);
    var stlViewElement = document.querySelector(".stlView");
    openGLRenderWindow.setContainer(stlViewElement);

    const { width, height } = stlViewElement.getBoundingClientRect();
    openGLRenderWindow.setSize(width, height);

    const  vtkRenderWindowInteractor = vtk.Rendering.Core.vtkRenderWindowInteractor.newInstance();
    vtkRenderWindowInteractor.setView(openGLRenderWindow);
    vtkRenderWindowInteractor.initialize();
    vtkRenderWindowInteractor.bindEvents(stlViewElement);

    const vtkInteractorStyleTrackballCamera = vtk.Interaction.Style.vtkInteractorStyleTrackballCamera.newInstance()
    vtkRenderWindowInteractor.setInteractorStyle(vtkInteractorStyleTrackballCamera);
}


function handleFile(event) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    const files = event.target.files || dataTransfer.files;

    if (files.length === 1) {
        // Dosya jsde boyle okunur
        const fileReader = new FileReader();

        fileReader.onload = function onLoad(e) {
            stlReader.parseAsArrayBuffer(fileReader.result);
            update();
        };

        fileReader.readAsArrayBuffer(files[0]);
    } else if (files.length > 1) {
        updateMulti(files)
    }
}

stlFileInput.addEventListener('change', handleFile)

let element = document.getElementById("submitButton");
const SERVER_URL = "https://snpnbj9ut1.execute-api.eu-west-2.amazonaws.com/v1/diff-calculator";

element.addEventListener("click", function(event) {
    event.stopPropagation();
    let requestBody = {
        mesh_points: pointDatas[0],
        point_cloud: pointDatas[1]
    };
    console.log(JSON.stringify(pointDatas).length);

    fetch(SERVER_URL, {
        method: "POST", 
        body: JSON.stringify(requestBody),
      }).then(res => {
          return res.text()
      }).then(res => console.log(res.length))
      .catch(err => console.log(err));
});

