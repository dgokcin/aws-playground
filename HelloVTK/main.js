const stlReader = vtk.IO.Geometry.vtkSTLReader.newInstance();
const mapper = vtk.Rendering.Core.vtkMapper.newInstance();
const actor = vtk.Rendering.Core.vtkActor.newInstance();

actor.getProperty().setColor(1.0000, 0.3882, 0.2784)
actor.setMapper(mapper)
mapper.setInputConnection(stlReader.getOutputPort())


var stlButtonWrapper = document.querySelector(".stlButtonWrapper");
var stlFileInput = stlButtonWrapper.querySelector('input')

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
            console.log(stlReader.getOutputData().getNumberOfPolys());
            // console.log(stlReader.getOutputData().getNumberOfLines());
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

