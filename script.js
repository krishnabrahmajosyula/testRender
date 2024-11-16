function toggleVisibility(element){
    console.log("eye clicked");
    let field=element.parentNode.querySelector("input");
    let eye=element.querySelector("i");
    if(field.type==="password"){
        field.type="text";
        eye.classList.remove("fa-eye");
        eye.classList.add("fa-eye-slash");
    }else{
        field.type="password";
        eye.classList.remove("fa-eye-slash");
        eye.classList.add("fa-eye");
    }
}
    document.getElementById("signinForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const username = document.getElementById("user-name").value;
        const password = document.getElementById("enter-password").value;
        const confirmpassword = document.getElementById("reverify-password").value;
        const artForm = document.getElementById("art-select").value;
        const isArtist = document.getElementById("isartist").checked;
        const contribute = document.getElementById("contribute").checked;

        if (password !== confirmpassword) {
            alert("Please enter the same password in the confirmation box.");
            return;
        }

        try {
            const response = await fetch("https://testrender-5uik.onrender.com/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, username, password, artForm, isArtist, contribute }),
            });
            const data = await response.json();
            alert(data.message);
        } catch {
            alert("Error signing up. Please try again");
        }
    });

    document.getElementById("uploadForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("modelName").value;
        const description = document.getElementById("modelDescription").value;
        const fileInput = document.getElementById("modelFile");
        const file = fileInput.files[0];
    
        if (!file) {
            alert("Please select a file of the format .glb");
            return;
        }
    
        const formData = new FormData();
        formData.append("modelfile", file);
        formData.append("name", name);  // Append name
        formData.append("description", description);  // Append description
    
        try {
            const response = await fetch("https://testrender-5uik.onrender.com/uploadmodel", { method: "POST", body: formData });
            const data = await response.json();
            if (response.ok) {
                alert("Model uploaded successfully");
            } else {
                alert("Failed to upload the model: " + data.message);
            }
        } catch (err) {
            console.error("Error uploading model files:", err);
            alert("Unable to upload the models. Please try again");
        }
    });
    
