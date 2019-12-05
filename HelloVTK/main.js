const stlReader = vtk.IO.Geometry.vtkSTLReader.newInstance();
const mapper = vtk.Rendering.Core.vtkMapper.newInstance();
const actor = vtk.Rendering.Core.vtkActor.newInstance();

actor.setMapper(mapper)
mapper.setInputConnection(stlReader.getOutputPort())


var stlButtonWrapper = document.querySelector(".stlButtonWrapper");
var stlFileInput = stlButtonWrapper.querySelector('input')

function update() {
    // const fullScreenRenderer = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance();
    // const renderer = fullScreenRenderer.getRenderer();
    // const renderWindow = fullScreenRenderer.getRenderWindow();
    const  vtkRenderWindow = vtk.Rendering.Core.vtkRenderWindow.newInstance();
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
    // renderer.addActor(actor);
    // renderer.resetCamera();
    // renderWindow.render();
}


function handleFile(event) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    const files = event.target.files || dataTransfer.files;
    if (files.length === 1) {
        stlButtonWrapper.removeChild(stlFileInput);
        
        // Dosya jsde boyle okunur
        const fileReader = new FileReader();
        
        fileReader.onload = function onLoad(e) {
            stlReader.parseAsArrayBuffer(fileReader.result);
            update();
        };

        fileReader.readAsArrayBuffer(files[0]);
    }
}

stlFileInput.addEventListener('change', handleFile)
