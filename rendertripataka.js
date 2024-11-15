const canvasScreen = document.getElementById("model-3d");
const renderEngine = new BABYLON.Engine(canvasScreen, true);

// Function to fetch model data by name
async function fetchModelByName(name) {
    try {
        const response = await fetch(`http://localhost:5000/models?name=${name}`);
        if (!response.ok) {
            throw new Error("Failed to retrieve model data");
        }
        const models = await response.json();
        return models.length > 0 ? models[0] : null; // Return the first match if exists
    } catch (error) {
        console.error("Error fetching model:", error);
    }
}

// Function to initialize and render the model
const modelScene = async function () {
    const scene = new BABYLON.Scene(renderEngine);

    // Set up camera and lighting
    const modelCamera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 35, BABYLON.Vector3.Zero(), scene);
    modelCamera.attachControl(canvasScreen, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    // Fetch and load the model
    const modelName = "Tripataka"; // Use the name of the model you want to retrieve
    const modelData = await fetchModelByName(modelName);

    if (modelData && modelData.fileData && modelData.fileType) {
        const blob = new Blob([new Uint8Array(modelData.fileData.data)], { type: modelData.fileType });
        const url = URL.createObjectURL(blob);

        // Explicitly specify GLTF loader plugin and extension
        BABYLON.SceneLoader.Append(url, "", scene, (newMeshes) => {
            console.log("Model Loaded:", newMeshes);
        }, null, (scene, message, exception) => {
            console.error("Failed to load model:", message, exception);
        }, ".glb"); // Force use of .glb format

    } else {
        console.error("Model data is missing or incomplete.");
    }

    return scene;
};

// Initialize and render the scene
(async () => {
    const screen = await modelScene();
    renderEngine.runRenderLoop(() => {
        screen.render();
    });
})();

// Handle window resize
window.addEventListener("resize", function () {
    renderEngine.resize();
});

// Mark as done functionality
let done = document.getElementById("done-button");
done.addEventListener("click", () => {
    const Id = "tripataka";
    localStorage.setItem(Id, "done");
    alert(`${Id.toUpperCase()} is marked done`);
});
