// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'eu-west-2'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-west-2:c29775f8-8606-4a24-9cef-d514c3bff48a',
});

AWS.config.credentials.get(function(err) {
    if (err) console.log(err);
    console.log(AWS.config.credentials);
});

var bucketName = 'stl-differ-original'; // Enter your bucket name
var bucket = new AWS.S3({
    params: {
        Bucket: bucketName
    }
});


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
        var file_original = files[0];
        // var file_pc = fileChooser.files[1];
        if (file_original) {
            var objKey = file_original.name;
            var params = {
                Key: objKey,
                ContentType: file_original.type,
                Body: file_original,
                // ACL: 'public-read-write'
            };

            bucket.putObject(params, function(err, data) {
                if (err) {
                    console.log(err)
                } else {
                    listObjs();
                }
            });
        } else {
            results.innerHTML = 'Nothing to upload.';
        }

        

        // var fd = new FormData();
        // fetch('https://snpnbj9ut1.execute-api.eu-west-2.amazonaws.com/v3', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     },
        //     body: fd
        // }).then(resp => {
        //     console.log(resp)
        // }).catch(err => {
        //     console.log(err);
        // });

        updateMulti(files)

    }
}

stlFileInput.addEventListener('change', handleFile)