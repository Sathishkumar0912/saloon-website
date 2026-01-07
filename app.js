let burger = document.querySelector(".burger");
let Links = document.querySelector(".nav-links");
let TextArea = document.querySelector(".text-center")
burger.addEventListener('click',()=>{
    Links.classList.toggle("nav-show");
    TextArea.classList.toggle("textareahide");
})

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        fname: e.target.fname.value,
        lname: e.target.lname.value,
        email: e.target.email.value,
        message: e.target.message.value
    };

    try {
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Thank you for reaching out to us! We will get back to you soon.");
            e.target.reset();
        } else {
            alert(data.error); // Shows the "Invalid email" or "Server error" message
        }
    } catch (error) {
        alert("Could not connect to the server.");
    }
});
    